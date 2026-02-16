# Cookie 功能测试清单

## 测试环境
- 打开 http://localhost:3000
- 首次访问或清除 `afore_cookie_consent` 和 `afore_cookie_preferences` 后刷新

## 测试步骤

### 1. Cookie Banner 显示
- [ ] 首次访问约 2–3 秒后出现 Cookie 同意弹窗
- [ ] 弹窗包含：标题、描述、**Accetta tutto**、**Accetta solo necessari**、**Opzioni** 按钮
- [ ] 点击背景或 X 关闭 → 等同于「只接受必要」

### 2. Accetta tutto
- [ ] 点击 **Accetta tutto**
- [ ] 弹窗关闭
- [ ] 刷新页面 → 弹窗不再出现
- [ ] DevTools → Application → Cookies → 应存在 `afore_cookie_consent=true`、`afore_cookie_preferences`（含 analytics/marketing/functional=true）
- [ ] 若已配置 `NEXT_PUBLIC_GA_ID`，应加载 Google Analytics 脚本

### 3. Accetta solo necessari
- [ ] 清除上述 Cookie 后刷新
- [ ] 点击 **Accetta solo necessari** 或 X
- [ ] 弹窗关闭
- [ ] Cookie 中 `afore_cookie_preferences` 应为 `{"necessary":true,"analytics":false,"marketing":false,"functional":false}`
- [ ] 不应加载 Google Analytics

### 4. Opzioni（偏好设置）
- [ ] 清除 Cookie 后刷新，点击 **Opzioni**
- [ ] 出现设置弹窗，含：Necessari（始终开启）、Analytics、Marketing、Functional 开关
- [ ] 可切换 Analytics 等，点击 **Salva preferenze** → 保存并关闭
- [ ] 刷新后不再出现主 banner

### 5. Footer 重新打开设置
- [ ] 在 Footer 点击 Cookie/隐私相关链接
- [ ] 应能重新打开 Cookie 设置弹窗
