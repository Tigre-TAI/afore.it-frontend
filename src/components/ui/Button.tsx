"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const VARIANTS = {
  primary:
    "h-11 inline-flex items-center justify-center gap-2 px-7 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-[#C01C20] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C01C20]/50",
  primaryInvert:
    "h-11 inline-flex items-center justify-center gap-2 px-7 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-white/95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50 active:bg-white",
  secondary:
    "inline-flex items-center gap-1 text-[#C01C20] font-semibold hover:opacity-80 hover:underline transition-opacity transition-[text-decoration] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C01C20]/50 [&_.btn-chevron]:opacity-70",
} as const;

const ChevronRight = (
  <svg className="w-4 h-4 flex-shrink-0 btn-chevron" width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExternalIcon = (
  <svg className="w-4 h-4 flex-shrink-0" width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/** 下载图标 — 与 stringa-7-10kw Area Download 一致 (document + arrow down) */
const DownloadIcon = (
  <svg className="w-4 h-4 flex-shrink-0" width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export type ButtonVariant = keyof typeof VARIANTS;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  /** Show trailing chevron (>) — default true for link variant */
  trailingChevron?: boolean;
  /** Show external-link icon — for primary opening in new tab */
  externalIcon?: boolean;
  /** Use <a> with download — for file downloads */
  download?: boolean;
};

type ButtonAsButton = ButtonBaseProps & Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & { href?: never };
type ButtonAsLink = ButtonBaseProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & { href: string };
type ButtonAsAnchor = ButtonBaseProps & Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps> & { href: string };

export type ButtonProps = (ButtonAsButton | ButtonAsLink | ButtonAsAnchor) & {
  /** If href is external (http/https/mailto), renders <a>. Else renders <Link>. No href = <button>. */
  href?: string;
};

function isExternalHref(h: string) {
  return /^(https?:|\/\/|mailto:)/.test(h);
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    className = "",
    children,
    trailingChevron,
    externalIcon,
    download,
    href,
    ...rest
  } = props;

  const baseClass = VARIANTS[variant];
  const showChevron = variant === "secondary" ? (trailingChevron ?? true) : (trailingChevron ?? false);
  const showExternal = externalIcon ?? false;

  const composedClassName = [baseClass, className].filter(Boolean).join(" ");

  const content = (
    <>
      {download && DownloadIcon}
      {children}
      {showChevron && ChevronRight}
      {showExternal && variant === "primary" && ExternalIcon}
    </>
  );

  if (href !== undefined) {
    if (download || isExternalHref(href)) {
      const { target = "_blank", rel = "noopener noreferrer", ...anchorProps } = rest as ComponentPropsWithoutRef<"a">;
      return (
        <a href={href} target={target} rel={rel} className={composedClassName} {...(download && { download: true })} {...anchorProps}>
          {content}
        </a>
      );
    }
    const linkRest = rest as Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;
    return (
      <Link href={href} className={composedClassName} {...linkRest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={composedClassName} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {content}
    </button>
  );
}
