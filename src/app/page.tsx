import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Afore Italia | Inverter Fotovoltaici e Accumulo",
    description: "Soluzioni fotovoltaiche avanzate per residenziale e commerciale.",
    alternates: {
      canonical: "https://www.afore.it/it",
    },
  };
}

// Server-side redirect to avoid client-side redirect issues in Google Search Console
export default function RootPage() {
  redirect("/it");
}
