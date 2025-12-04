import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Documentazione Inverter Ibridi | Afore Italia",
    description: "Manuali di installazione, schede tecniche e certificazioni degli inverter ibridi Afore per il mercato italiano.",
    alternates: {
      canonical: "https://www.afore.it/it/documentazione/inverter-ibridi",
    },
  };
}

export default function InverterIbridiPage() {
  return (
    <main className="container">
      <h1>Documentazione Inverter Ibridi</h1>
      <p>
        In questa sezione puoi scaricare manuali di installazione, schede tecniche e certificazioni
        degli inverter ibridi Afore.
      </p>
      <ul>
        <li><a href="/docs/it/inverter-ibridi/manuale-installazione.pdf">Manuale di installazione</a></li>
        <li><a href="/docs/it/inverter-ibridi/scheda-tecnica.pdf">Scheda tecnica</a></li>
        <li><a href="/docs/it/inverter-ibridi/certificazioni.pdf">Certificazioni</a></li>
      </ul>
    </main>
  );
}

