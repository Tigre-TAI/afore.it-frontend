"use client";

/**
 * FlatList — Minimal list with divide-y only.
 * No border, no bg, no rounded — Apple-style content flow.
 */
export default function FlatList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul className={["divide-y divide-slate-200", className].filter(Boolean).join(" ")}>
      {children}
    </ul>
  );
}
