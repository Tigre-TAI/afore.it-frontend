import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const app = express();
const PORT = process.env.PORT || 3001;
const useResend = !!process.env.RESEND_API_KEY;

const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map((o) => o.trim());
app.use(
  cors({
    origin: corsOrigins,
    methods: ["POST", "OPTIONS"],
  })
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo JPG e PNG"), false);
    }
  },
});

const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const resendClient = useResend ? new Resend(process.env.RESEND_API_KEY) : null;

app.post(
  "/api/contact",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { name, phone, email, category, reason, _subject } = req.body;
      const files = req.files || [];
      const toEmail = process.env.CONTACT_EMAIL_TO || process.env.GMAIL_USER;

      if (!name?.trim() || !phone?.trim() || !email?.trim()) {
        return res.status(400).json({ error: "Name, phone, email are required" });
      }

      const categoryLabels = {
        installatori: "Installatori",
        commerciali: "Commerciali",
        installatoriCommerciali: "Installatori e Commerciali",
        clientiFinali: "Clienti finali",
      };

      const categoryLabel = categoryLabels[category] || category;
      const subject = _subject || "Richiesta di contatto - Afore";

      let html = `
        <h2>Nuova richiesta di contatto</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Tipologia:</strong> ${escapeHtml(categoryLabel)}</p>
        <p><strong>Motivo:</strong></p>
        <p>${escapeHtml(reason || "-").replace(/\n/g, "<br>")}</p>
      `;

      const attachments = files.map((f) => ({
        filename: f.originalname,
        content: f.buffer,
      }));

      if (attachments.length > 0) {
        html += `<p><strong>Allegati:</strong> ${attachments.length} immagine/i</p>`;
      }

      if (resendClient) {
        const resendAttachments = files.map((f) => ({
          filename: f.originalname,
          content: f.buffer,
        }));
        const { error } = await resendClient.emails.send({
          from: process.env.RESEND_FROM || "Afore Contatti <onboarding@resend.dev>",
          to: [toEmail],
          subject,
          html,
          attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
        });
        if (error) throw new Error(error.message);
      } else {
        await nodemailerTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: toEmail,
          subject,
          html,
          attachments: files.map((f) => ({ filename: f.originalname, content: f.buffer })),
        });
      }

      res.json({ success: true });
    } catch (err) {
      const msg = err.message || String(err);
      console.error("Contact form error:", msg);
      const isDev = process.env.NODE_ENV !== "production";
      res.status(500).json({
        error: isDev ? msg : "Errore invio",
      });
    }
  }
);

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.use((err, req, res, next) => {
  console.error("Upload error:", err);
  res.status(400).json({ error: err.message || "Invalid upload" });
});

app.get("/", (req, res) => {
  res.json({
    service: "Afore Contact API",
    endpoints: {
      "GET /api/health": "Health check",
      "POST /api/contact": "Contact form submission",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, email: useResend ? "Resend" : "Gmail" });
});

app.listen(PORT, () => {
  console.log(`Contact API on http://localhost:${PORT} (${useResend ? "Resend" : "Gmail"})`);
  if (!useResend && !process.env.GMAIL_APP_PASSWORD) {
    console.warn("WARNING: Set GMAIL_APP_PASSWORD or RESEND_API_KEY in server/.env");
  }
});
