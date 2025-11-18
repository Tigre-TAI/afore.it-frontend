// src/app/documentazione/inverter-ibridi/page.tsx
import Link from "next/link";

type DocItem = {
  title: string;
  href: string;
  meta?: string;
};

type DocSection = {
  heading: string;
  items: DocItem[];
};

function Section({ title, sections }: { title: string; sections: DocSection[] }) {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        <div className="mt-6 space-y-8">
          {sections.map((sec) => (
            <div key={sec.heading}>
              <h3 className="text-lg font-bold text-slate-800">{sec.heading}</h3>
              <ul className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {sec.items.map((it) => (
                  <li key={it.href} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{it.title}</p>
                      {it.meta ? <p className="text-xs text-slate-500 mt-0.5">{it.meta}</p> : null}
                    </div>
                    <Link
                      href={it.href}
                      className="shrink-0 rounded-md bg-brand-600 px-3 py-1.5 text-white text-sm font-semibold hover:bg-brand-500"
                      target="_blank"
                    >
                      Download
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InverterIbridiPage() {
  // Base prefix for convenience
  const base = "https://www.afore.it/documentazione";

  const afslCei: DocSection[] = [
    {
      heading: "CEI 0-21",
      items: [
        {
          title:
            "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria AFORE AF5000W‑L1",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-AFORE-AF5000W-L1.pdf`,
        },
        {
          title: "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria ATOM‑LS",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-ATOM-LS.pdf`,
        },
        {
          title:
            "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria ATOM‑WB512100",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-ATOM-WB512100.pdf`,
        },
        {
          title: "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria HERO‑LVA",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-HERO-LVA.pdf`,
        },
        {
          title: "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria LFP‑WALL",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-LFP-WALL.pdf`,
        },
        {
          title: "Inverter Ibrido Monofase AF‑SL 1–6kW · CEI‑021 · Batteria PW512100",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_1-6kW_CEI-021_Batteria-PW512100.pdf`,
        },
      ],
    },
    {
      heading: "Guida alla compilazione del regolamento di esercizio",
      items: [
        {
          title:
            "Inverter Ibrido Monofase AF‑SL · Guida Regolamento di Esercizio · Batterie AFORE",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_Guida-Regolamento-Esercizio_Batterie-AFORE.pdf`,
        },
      ],
    },
    {
      heading: "Guida alla compilazione dell'addendum tecnico",
      items: [
        {
          title:
            "Inverter Ibrido Monofase AF‑SL · Guida Addendum Tecnico · Batterie AF5000W‑LF e AF10000W‑LG",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_Guida-Addendum-Tecnico_Batterie-AF5000W-LF-e-AF10000W-LG.pdf`,
        },
      ],
    },
    {
      heading: "Dichiarazione di Conformità",
      items: [
        {
          title:
            "Inverter Ibrido Monofase AF‑SL · Dichiarazione di Conformità · Batteria AF6K‑SL",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_Dichiarazione-Conformita_Batteria-AF6K-SL.pdf`,
        },
        {
          title:
            "Inverter Ibrido Monofase AF‑SL · Dichiarazione di Conformità · Batteria AF5000W‑LF",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_Dichiarazione-Conformita_Batteria-AF5000W-LF.pdf`,
        },
        {
          title:
            "Inverter Ibrido Monofase AF‑SL · Dichiarazione di Conformità · Batteria AF10000W‑LG",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Monofase_AF-SL_Dichiarazione-Conformita_Batteria-AF10000W-LG.pdf`,
        },
      ],
    },
    {
      heading: "Test Report / Verification of Conformity",
      items: [
        {
          title:
            "Inverter Ibrido Monofase AF‑SL 1–6kW · Test Report EN62109‑1:2010 (INTERTEK) [EN]",
          href: `${base}/PV_INVERTER/EN_Inverter_Ibrido_Monofase_AF-SL_1-6kW_TestReport_EN62109-1-2010_INTERTEK.pdf`,
        },
        {
          title:
            "Inverter Ibrido Monofase AF‑SL 1–6kW · Test Report EN62109‑2:2011 (VOC) [EN]",
          href: `${base}/PV_INVERTER/EN_Inverter_di_Stringa_Monofase_HNS_3-10kW_TestReport_EN62109-2_VOC.pdf`,
        },
      ],
    },
  ];

  const afthCei: DocSection[] = [
    {
      heading: "CEI 0-21",
      items: [
        {
          title: "Inverter Ibrido Trifase AF‑TH 20–30kW · CEI‑021 · HERO‑HV",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_20-30kW_CEI-021_HERO-HV.pdf`,
        },
        {
          title: "Inverter Ibrido Trifase AF‑TH 3–30kW · CEI‑021 · ATOM‑HS",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_3-30kW_CEI-021_ATOM-HS.pdf`,
        },
        {
          title: "Inverter Ibrido Trifase AF‑TH 3–17kW · CEI‑021 · HERO‑HV",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_3-17kW_CEI-021_HERO-HV.pdf`,
        },
        {
          title: "Inverter Ibrido Trifase AF‑TH 36–60kW · CEI‑021 · ATOM‑HS",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_36-60kW_CEI-021_ATOM-HS.pdf`,
        },
      ],
    },
    {
      heading: "Test Report",
      items: [
        {
          title:
            "Inverter Ibrido Trifase AF‑TH 3–30kW · EN62109‑1 (INTERTEK) [EN]",
          href: `${base}/PV_INVERTER/EN_Inverter_Ibrido_Trifase_AF-TH_3-30kW_TestReport_EN62109-1_INTERTEK.pdf`,
        },
        {
          title:
            "Inverter Ibrido Trifase AF‑TH 3–30kW · EN62109‑2 (INTERTEK) [EN]",
          href: `${base}/PV_INVERTER/EN_Inverter_Ibrido_Trifase_AF-TH_3-30kW_TestReport_EN62109-2_INTERTEK.pdf`,
        },
        {
          title:
            "Inverter Ibrido Trifase AF‑TH 36–60kW · Test Report (DEKRA) [EN]",
          href: `${base}/PV_INVERTER/EN_Inverter_Ibrido_Trifase_AF-TH_36-60kW_TestReport_DEKRA.pdf`,
        },
      ],
    },
    {
      heading: "Guida Addendum Tecnico",
      items: [
        {
          title:
            "Inverter Ibrido Trifase AF‑TH · Guida Addendum Tecnico Sistemi Ibridi Trifase",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_Guida-Addendum-Tecnico-Sistemi-Ibridi-Trifase.pdf`,
        },
        {
          title: "Inverter Ibrido Trifase AF‑TH · Guida Addendum Tecnico",
          href: `${base}/PV_INVERTER/IT_Inverter_Ibrido_Trifase_AF-TH_Guida-Addendum-Tecnico.pdf`,
        },
      ],
    },
  ];

  return (
    <>
      <section className="relative -mt-16 pt-16">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14 text-white">
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Certificati PV Inverter Ibridi
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Certificazioni e guide aggiornate con compatibilità batteria.
          </p>
        </div>
      </section>

      <Section title="Inverter Ibrido Monofase AF‑SL" sections={afslCei} />
      <Section title="Inverter Ibrido Trifase AF‑TH" sections={afthCei} />
    </>
  );
}


