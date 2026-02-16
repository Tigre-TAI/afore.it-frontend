/**
 * 测试 Gmail SMTP 连接
 * 运行: node test-gmail.js
 */
import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

console.log("Testing Gmail SMTP...");
console.log("User:", process.env.GMAIL_USER);
console.log("Password set:", !!process.env.GMAIL_APP_PASSWORD);

transporter
  .verify()
  .then(() => {
    console.log("✓ Gmail SMTP OK - 可以正常发邮件");
    return transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.CONTACT_EMAIL_TO || process.env.GMAIL_USER,
      subject: "Test - Afore Contact Form",
      text: "这是一封测试邮件，说明联系表单可以正常发送。",
    });
  })
  .then(() => console.log("✓ 测试邮件已发送，请查收"))
  .catch((err) => {
    console.error("✗ 错误:", err.message);
    if (err.message.includes("BadCredentials")) {
      console.log("\n请检查:");
      console.log("1. Gmail 已开启两步验证");
      console.log("2. 在 https://myaccount.google.com/apppasswords 重新生成应用密码");
      console.log("3. 复制 16 位密码（无空格）到 server/.env 的 GMAIL_APP_PASSWORD");
    }
  });
