import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const validLang = ["it", "en", "es"].includes(lang) ? lang : "it";

  return (
    <html lang={validLang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

