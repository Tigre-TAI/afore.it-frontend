#!/usr/bin/env bash
# 将 public/video/earth-rotation.mov 转为 MP4，在保证清晰度的前提下控制体积（便于 AWS 托管）
# 依赖：需先安装 ffmpeg，例如 brew install ffmpeg
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INPUT="$PROJECT_ROOT/public/video/earth-rotation.mov"
OUTPUT="$PROJECT_ROOT/public/video/earth-rotation.mp4"

if ! command -v ffmpeg &>/dev/null; then
  echo "错误：未找到 ffmpeg。请先安装：brew install ffmpeg"
  exit 1
fi
if [[ ! -f "$INPUT" ]]; then
  echo "错误：未找到 $INPUT"
  exit 1
fi

echo "正在转换（保持清晰度并控制体积）..."
# -crf 24：画质与体积平衡（约 23–26 清晰度好，体积适中）
# -preset slow：压缩更高效，体积更小
# -vf scale=1920:-2：最大宽 1920px，高度按比例且为 2 的倍数（控制体积）
# -movflags +faststart：便于网页流式播放
# -an：去掉音轨（背景视频无需声音，进一步减小体积）
ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -preset slow \
  -crf 24 \
  -vf "scale='min(1920,iw)':-2" \
  -movflags +faststart \
  -an \
  -y \
  "$OUTPUT"

echo "完成。输出：$OUTPUT"
ls -lh "$OUTPUT"
