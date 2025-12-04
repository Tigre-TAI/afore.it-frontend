import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Inverter Ibrido Afore H3-6.0 | Afore Italia",
    description: "Inverter ibrido trifase da 6 kW per impianti residenziali e commerciali, con MPPT ad alta efficienza e compatibilità con sistemi di accumulo.",
    alternates: {
      canonical: "https://www.afore.it/it/prodotti/h3-6kw",
    },
  };
}

export default function H36KwPage() {
  return <div />;
}


