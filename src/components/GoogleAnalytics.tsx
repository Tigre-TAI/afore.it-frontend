"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isCookieAllowed } from "@/lib/cookies";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // 初始化 Google Analytics
  useEffect(() => {
    // 检查是否有 GA ID 配置
    if (!gaId) {
      console.warn("Google Analytics ID not configured");
      return;
    }

    // 检查用户是否同意分析 Cookie
    if (!isCookieAllowed("analytics")) {
      return;
    }

    // 加载 gtag.js
    const script1 = document.createElement("script");
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // 初始化 dataLayer 和 gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    // 配置 GA
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      send_page_view: true,
    });

    return () => {
      // 清理：移除脚本（可选，通常不需要）
      const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
      scripts.forEach((script) => script.remove());
    };
  }, [gaId]);

  // 监听路由变化并发送页面浏览事件
  useEffect(() => {
    if (!gaId || !isCookieAllowed("analytics")) {
      return;
    }

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag?.("config", gaId, {
      page_path: url,
      send_page_view: true,
    });
  }, [pathname, searchParams, gaId]);

  // 监听 Cookie 偏好变化
  useEffect(() => {
    const handleCookieUpdate = (event: CustomEvent) => {
      const preferences = event.detail;
      
      if (preferences.analytics && gaId) {
        // 用户刚刚同意了分析 Cookie，初始化 GA
        if (!window.gtag) {
          const script1 = document.createElement("script");
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          script1.async = true;
          document.head.appendChild(script1);

          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(...args: any[]) {
            window.dataLayer.push(args);
          };

          window.gtag("js", new Date());
          window.gtag("config", gaId, {
            page_path: window.location.pathname + window.location.search,
            send_page_view: true,
          });
        }
      } else if (!preferences.analytics) {
        // 用户拒绝了分析 Cookie，停止跟踪
        // 注意：GA 脚本已加载，但我们可以禁用自动页面浏览
        // 或者完全移除脚本（更彻底）
        const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
        scripts.forEach((script) => script.remove());
        window.gtag = undefined;
        window.dataLayer = [];
      }
    };

    window.addEventListener("cookiePreferencesUpdated", handleCookieUpdate as EventListener);

    return () => {
      window.removeEventListener("cookiePreferencesUpdated", handleCookieUpdate as EventListener);
    };
  }, [gaId]);

  return null; // 此组件不渲染任何内容
}
