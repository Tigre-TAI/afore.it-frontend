# Scripts

## 视频转换：地球背景 MP4（控制体积 + 保持清晰度）

将 `public/video/earth-rotation.mov` 转为适合网页的 `earth-rotation.mp4`，便于各浏览器播放并控制 AWS 存储与流量。

**依赖**：需先安装 [ffmpeg](https://ffmpeg.org/)（macOS: `brew install ffmpeg`）

**运行**：

```bash
npm run video:convert-earth
```

或直接：

```bash
bash scripts/convert-earth-video.sh
```

**效果**：输出 `public/video/earth-rotation.mp4`，H.264、最大宽度 1920px、CRF 24、无音轨，体积远小于原 .mov。
