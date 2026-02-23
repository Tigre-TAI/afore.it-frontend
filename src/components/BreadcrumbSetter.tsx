"use client";

import { useEffect } from "react";
import { useBreadcrumb, type Crumb } from "@/components/BreadcrumbContext";

/** 供服务端页面使用：传入 breadcrumb 项，会设置到全局 BreadcrumbBar */
export default function BreadcrumbSetter({ items }: { items: Crumb[] }) {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems(items);
    return () => setItems(null);
  }, [items, setItems]);
  return null;
}
