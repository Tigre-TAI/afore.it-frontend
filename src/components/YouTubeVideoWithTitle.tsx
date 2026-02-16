"use client";

import { useEffect, useState } from "react";

type Props = {
  videoId: string;
  className?: string;
  titleClassName?: string;
};

/**
 * YouTube 视频 + 使用 YouTube 官方标题（通过 oEmbed 获取）
 */
export default function YouTubeVideoWithTitle({
  videoId,
  className = "",
  titleClassName = "mt-2 text-sm font-medium text-slate-700",
}: Props) {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // noembed.com supports CORS; works with static export (no API routes)
    fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
    )
      .then((r) => r.json())
      .then((data: { title?: string }) => {
        if (!cancelled && data.title) setTitle(data.title);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  return (
    <div className={className}>
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        <iframe
          title={title || videoId}
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      {title && <p className={titleClassName}>{title}</p>}
    </div>
  );
}
