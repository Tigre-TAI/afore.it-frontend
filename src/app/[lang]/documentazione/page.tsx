// src/app/documentazione/page.tsx
import Link from "next/link";
import Image from "next/image";
// [CHANGED] 新增：引入新版面包屑组件
import Breadcrumb from "@/components/ui/Breadcrumbs";

export default function DocumentazionePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Documentazione"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          {/* [CHANGED] 新版面包屑：深色背景 -> 白色主题 */}
          <Breadcrumb theme="dark" />

          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            Documentazione
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Garanzie, certificazioni, compatibilità, archivio e responsabilità sociale.
          </p>
        </div>
      </section>

      {/* 搜索条 */}
      <section className="relative z-10 mt-10 md:mt-14 lg:mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <form
            action="/documentazione"
            method="GET"
            className="flex w-full bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-black/5"
          >
            <div className="pl-5 flex items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.2-4.2M10.8 18.4a7.6 7.6 0 1 1 0-15.2 7.6 7.6 0 0 1 0 15.2Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <input
              name="q"
              className="flex-1 px-4 py-4 text-sm md:text-base outline-none"
              placeholder="DIGITA IL NOME DEL FILE DA SCARICARE"
              aria-label="Cerca documento"
            />
            <button
              type="submit"
              className="shrink-0 px-6 md:px-10 py-4 bg-brand-600 text-white font-semibold hover:bg-brand-500"
            >
              CERCA
            </button>
          </form>
        </div>
      </section>

      {/* 产品下载筛选区 */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-center text-xl md:text-2xl font-extrabold tracking-wide">
            DOWNLOAD RELATIVI AI PRODOTTI
          </h2>
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-brand-600" />

          <form
      action="/documentazione"
      method="GET"
      className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      {/* 第一行 */}
      <div className="col-span-1">
        <label className="block text-sm mb-2 text-slate-700">Tipo di prodotto</label>
        <div className="relative">
          <select
            name="prodotto"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
            <option value="pv-inverter">PV Inverter</option>
            <option value="batteria-accumulo">Batteria di Accumulo</option>
            <option value="all-in-one">All in One</option>
            <option value="ev-charger">EV Charger</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>

      <div className="col-span-1 opacity-60">
        <label className="block text-sm mb-2 text-slate-700">Serie / Modello</label>
        <div className="relative">
          <select
            name="modello"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>

      <div className="col-span-1 opacity-60">
        <label className="block text-sm mb-2 text-slate-700">Potenza</label>
        <div className="relative">
          <select
            name="potenza"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>

      {/* 第二行 */}
      <div className="col-span-1">
        <label className="block text-sm mb-2 text-slate-700">Tipo di documento</label>
        <div className="relative">
          <select
            name="tipo"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
            <option value="scheda-tecnica">Scheda Tecnica</option>
            <option value="manuale">Manuale</option>
            <option value="cei">CEI-16 &amp; CEI-021</option>
            <option value="guida-regolamento">Guida Regolamento di Esercizio</option>
            <option value="garanzia">Garanzia</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>

      <div className="col-span-1">
        <label className="block text-sm mb-2 text-slate-700">Lingua</label>
        <div className="relative">
          <select
            name="lingua"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>

      <div className="col-span-1">
        <label className="block text-sm mb-2 text-slate-700">Regione</label>
        <div className="relative">
          <select
            name="regione"
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            defaultValue=""
          >
            <option value="">SELEZIONA</option>
            <option value="it">Italia</option>
            <option value="fr">Francia</option>
            <option value="es">Spagna</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
        </div>
      </div>
    </form>
  </div>
</section>

      {/* 6 张入口卡片 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { n: "01", href: "/documentazione/scheda-tecnica", icon: "/icons/scheda.svg", title: "Scheda Tecnica" },
              { n: "02", href: "/documentazione/manuale",          icon: "/icons/manuale.svg", title: "Manuale" },
              { n: "03", href: "/documentazione/cei",              icon: "/icons/cei.svg",     title: "CEI-16 & CEI-021" },
              { n: "04", href: "/documentazione/guida",icon: "/icons/guida.svg",   title: "Guida Regolamento di Esercizio" },
              { n: "05", href: "/garanzia",                        icon: "/icons/garanzia.svg",title: "Garanzia" },
              { n: "06", href: "/documentazione/archivio",         icon: "/icons/archivio.svg",title: "Archivio Documentazione" },
            ].map((c) => (
              <Link
                key={c.n}
                href={c.href}
                className="group relative overflow-hidden rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
              >
                {/* 背景大号序号水印 */}
                <div className="absolute left-4 top-2 select-none text-6xl sm:text-7xl font-extrabold text-slate-200/50">
                  {c.n}
                </div>

                <div className="p-8 min-h-[220px] flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 mb-4">
                    <Image src={c.icon} alt={c.title} width={64} height={64} className="mx-auto" />
                  </div>
                  <h3 className="font-extrabold text-brand-600 uppercase tracking-wide">
                    {c.title}
                  </h3>
                </div>

                {/* [HERE] 底部高亮条 */}
                <div className="absolute left-0 bottom-0 h-1 w-0 bg-brand-600 transition-[width] duration-300 group-hover:w-full group-focus-visible:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


