# 视频文件

## 首页 Brand Short Video

将品牌短视频放在此目录，首页「Brand Short Video」区块会引用它。

**默认文件名**：`brand-short.mp4`  
**访问路径**：`/video/brand-short.mp4`

- 若使用其他文件名或路径，可在 `src/components/BrandShortVideo.tsx` 中为首页传入 `videoSrc`，或在页面层覆盖默认值。
- 建议格式：MP4（H.264），便于各浏览器播放；可另放一张封面图并在组件中设置 `poster`。

---

## 数据可视化区块地球背景

**文件名**：`earth-rotation.mp4` 或 `earth-rotation.mov`  
- **推荐**：使用 **MP4（H.264）** 并命名为 `earth-rotation.mp4`，Chrome/Firefox/Edge 才能正常播放。  
- 仅放 `.mov` 时只有 Safari 可能能播；可将 .mov 转为 .mp4（如用 ffmpeg：`ffmpeg -i earth-rotation.mov -c:v libx264 -preset slow -crf 22 earth-rotation.mp4`）。

---

## 通讯稿：Key Energy 2026 Afore Italia 顶部视频

**文件夹**：`public/video/`（本目录）  
**文件名**：`key-energy-2026-afore-italia.mp4`  
**访问路径**：`/video/key-energy-2026-afore-italia.mp4`

- 用于页面 `/it/comunicati-stampa/key-energy-2026-afore-italia` 顶部视频区块，带声音开关。
- 建议格式：MP4（H.264），便于各浏览器播放。
