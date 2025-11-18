import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Afore Italia",
  description: "Afore Italia - Soluzioni per l'energia solare",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/image/logos/logo_afore_favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/image/logos/logo_afore_favicon.ico", sizes: "180x180", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout only handles the redirect page
  // Actual content is handled by [lang]/layout.tsx
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
