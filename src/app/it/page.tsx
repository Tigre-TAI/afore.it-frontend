import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Afore Italia | Inverter Fotovoltaici per il mercato italiano",
    description: "Soluzioni fotovoltaiche per il mercato italiano: inverter di stringa, inverter ibridi e sistemi di accumulo.",
    alternates: {
      canonical: "https://www.afore.it/it",
    },
  };
}

export default function ItPage() {
  return <div />;
}

