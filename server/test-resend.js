/**
 * Test Resend API – run: node server/test-resend.js
 * Requires RESEND_API_KEY and CONTACT_EMAIL_TO in server/.env
 */
import "dotenv/config";
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
const to = process.env.CONTACT_EMAIL_TO || process.env.GMAIL_USER;

if (!key) {
  console.error("Set RESEND_API_KEY in server/.env");
  process.exit(1);
}
if (!to) {
  console.error("Set CONTACT_EMAIL_TO in server/.env");
  process.exit(1);
}

const resend = new Resend(key);
const from = process.env.RESEND_FROM || "Afore Contatti <onboarding@resend.dev>";

const { data, error } = await resend.emails.send({
  from,
  to: [to],
  subject: "Test Afore Contatti",
  html: "<p>Email inviata correttamente da Resend.</p>",
});

if (error) {
  console.error("Errore:", error.message || error);
  process.exit(1);
}
console.log("OK – email inviata:", data?.id);
console.log("Controlla", to);
