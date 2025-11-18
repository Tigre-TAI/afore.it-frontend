// src/components/DownloadItem.tsx
"use client";

import { useState } from "react";

export type DownloadItemProps = {
  name: string;             // 显示的名称，如 “Scheda Tecnica”
  fileUrl: string;          // 具体文件地址（/prodotti/<id>/downloads/xxx.pdf）
  meta?: { label: string; value: string }[]; // 右侧小信息，如语言/类型…
  defaultOpen?: boolean;
  className?: string;
};

export default function DownloadItem({
  name,
  fileUrl,
  meta = [],
  defaultOpen = false,
  className = "",
}: DownloadItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-lg border ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold"
      >
        <span>{name}</span>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener"
            className="text-red-600 underline font-medium"
          >
            {fileUrl.split("/").pop()}
          </a>

          {meta.length > 0 && (
            <ul className="text-sm text-slate-600 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {meta.map((m) => (
                <li key={m.label}>
                  {m.label}: <strong>{m.value}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
