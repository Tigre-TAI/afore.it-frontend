# Checklist 上线前 - Afore.it

## ✅ 已完成检查

- [x] `npm run build` 编译通过
- [x] 联系表单本地测试正常（Gmail 发件）
- [x] Deploy workflow 支持 `NEXT_PUBLIC_CONTACT_FORM_ACTION`

## ⚠️ 上线前必做

### 1. GitHub Secrets 配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `NEXT_PUBLIC_CONTACT_FORM_ACTION` | 联系表单 API 地址 | `https://api.afore.it/api/contact` |
| `AWS_ROLE_ARN` | AWS 部署角色 | （已有） |
| `AWS_REGION` | AWS 区域 | （已有） |
| `AWS_S3_BUCKET` | S3 桶名 | （已有） |
| `AWS_CLOUDFRONT_ID` | CloudFront 分发 ID | （已有） |

**若未设置 `NEXT_PUBLIC_CONTACT_FORM_ACTION`**：联系表单提交后不会发邮件（前端无报错，但不会请求任何 API）。

### 2. 部署 API 服务器 (server/)

`server/` 需要单独部署到支持 Node.js 的服务器，例如：

- **Railway** / **Render** / **Fly.io**
- **AWS EC2** + PM2
- **Vercel Serverless**（需调整 server 为 serverless 函数）

部署时配置环境变量：
```
GMAIL_USER=wibysito@gmail.com
GMAIL_APP_PASSWORD=你的App密码
CONTACT_EMAIL_TO=wibysito@gmail.com
CORS_ORIGINS=https://www.afore.it,https://afore.it
```

### 3. CORS

在 `server/.env` 的 `CORS_ORIGINS` 中加入线上域名，例如：
```
CORS_ORIGINS=https://www.afore.it,https://afore.it
```

### 4. 翻译缺失（可选）

Build 时会有 `Translation missing for key: home.cases.case9` 等警告。原因是 `public/image/cases/` 仅有 `case_01.jpg`–`case_08.jpg`。若需展示更多案例，需先添加 `case_09.jpg` 等图片，再在 `src/locales/*.json` 补充 case9–20 的翻译。

## 📋 部署流程

1. 先部署 `server/` 到线上，获取 API 地址（如 `https://api.afore.it/api/contact`）
2. 在 GitHub Secrets 添加 `NEXT_PUBLIC_CONTACT_FORM_ACTION`
3. Push 到 `main` 分支，触发 GitHub Actions 部署前端
4. 在线上网站测试联系表单
