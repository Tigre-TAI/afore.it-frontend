"use client";

/**
 * FlatSection — Apple-style flat section wrapper
 * Consistent py-12 md:py-16, optional border-top divider for structure.
 * No shadow, no rounded-2xl, typography + whitespace for hierarchy.
 */
export default function FlatSection({
  children,
  className = "",
  as: Component = "section",
  withDivider = false,
  bg = "white",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  /** Add a subtle top border separator */
  withDivider?: boolean;
  /** bg-white | bg-slate-50 | bg-transparent */
  bg?: "white" | "slate-50" | "transparent";
}) {
  const bgClass = {
    white: "bg-white",
    "slate-50": "bg-slate-50",
    transparent: "",
  }[bg];

  return (
    <Component
      className={[
        "py-12 md:py-16",
        bgClass,
        withDivider ? "border-t border-slate-200" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
