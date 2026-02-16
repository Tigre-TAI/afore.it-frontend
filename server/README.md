# Afore 联系表单 API 服务

接收前端联系表单提交，通过 Resend 或 Gmail SMTP 发送邮件。

## 推荐：使用 Resend（免 SMTP 配置）

1. 打开 https://resend.com 注册
2. 在 API Keys 创建密钥，复制
3. 在 `server/.env` 添加：
   ```
   RESEND_API_KEY=re_你的密钥
   RESEND_FROM=Afore Contatti <onboarding@resend.dev>
   CONTACT_EMAIL_TO=wibysito@gmail.com
   ```
4. 启动：`cd server && npm run dev`

## 或使用 Gmail SMTP

在 `.env` 配置 GMAIL_USER 和 GMAIL_APP_PASSWORD（应用专用密码）。若出现 BadCredentials，建议改用 Resend。

## 快速启动

```bash
cd server
npm install
npm run dev
```

## 健康检查

`GET http://localhost:3001/api/health` 可验证服务是否正常。
