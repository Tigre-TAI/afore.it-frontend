"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/**
 * DataVizSection — 地球自转视频背景 + 动态数据可视化（I Nostri Prodotti 下方）
 * 背景：全黑 + 地球视频循环播放
 * 双视频交叉切换实现无缝循环，避免 loop 时的跳帧/卡顿
 */

const VIDEO_SRC = "/video/earth-rotation.mp4";
const LOOP_LEAD = 0.35; // 提前多少秒切换到下一段，实现无缝衔接

export default function DataVizSection() {
  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const switchingRef = useRef(false);

  const switchTo = useCallback((next: 0 | 1) => {
    if (switchingRef.current) return;
    const curr = next === 0 ? 1 : 0;
    const currEl = curr === 0 ? video0Ref.current : video1Ref.current;
    const nextEl = next === 0 ? video0Ref.current : video1Ref.current;
    if (!currEl || !nextEl) return;

    switchingRef.current = true;
    nextEl.currentTime = 0;
    nextEl.play().catch(() => {});
    currEl.pause();
    currEl.currentTime = 0;
    setActiveIndex(next);
    // 允许下一轮切换（避免同一段内重复触发）
    const t = setTimeout(() => {
      switchingRef.current = false;
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const v0 = video0Ref.current;
    const v1 = video1Ref.current;
    if (!v0 || !v1) return;

    const onTimeUpdate = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      const d = v.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (v.currentTime < d - LOOP_LEAD) return;
      const isV0 = v === v0;
      switchTo(isV0 ? 1 : 0);
    };

    v0.addEventListener("timeupdate", onTimeUpdate);
    v1.addEventListener("timeupdate", onTimeUpdate);
    v0.play().catch(() => {});

    return () => {
      v0.removeEventListener("timeupdate", onTimeUpdate);
      v1.removeEventListener("timeupdate", onTimeUpdate);
      v0.pause();
      v1.pause();
    };
  }, [switchTo]);

  return (
    <section
      id="data-viz"
      className="relative w-full bg-black overflow-hidden"
      style={{ aspectRatio: "16/9" }}
      aria-label="Data visualization"
    >
      {/* 双视频无缝轮播：GPU 层 + 交叉切换，避免 loop 卡顿 */}
      <div
        className="absolute inset-0 [contain:strict] [will-change:transform]"
        style={{ transform: "translateZ(0)" }}
      >
        <video
          ref={video0Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
          style={{ opacity: activeIndex === 0 ? 1 : 0, pointerEvents: "none" }}
          muted
          playsInline
          preload="auto"
          aria-hidden
          src={VIDEO_SRC}
        />
        <video
          ref={video1Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
          style={{ opacity: activeIndex === 1 ? 1 : 0, pointerEvents: "none" }}
          muted
          playsInline
          preload="auto"
          aria-hidden
          src={VIDEO_SRC}
        />
      </div>

      {/* 内容层：后续放动态数据可视化 */}
      <div className="relative z-10 absolute inset-0 flex items-center justify-center">
        <div className="container w-full">
          {/* 预留数据可视化区域 */}
        </div>
      </div>
    </section>
  );
}
