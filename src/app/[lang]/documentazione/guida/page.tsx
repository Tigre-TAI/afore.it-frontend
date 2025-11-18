import Breadcrumb from "@/components/ui/Breadcrumbs";
import Filters from "../_components/Filters";
import DocumentList from "../_components/DocumentList";

export default function GuidaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Guida Regolamento di Esercizio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: "Home", href: "/" },
              { label: "Documentazione", href: "/documentazione" },
              { label: "Guida Regolamento di Esercizio" },
            ]}
          />
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            Guida Regolamento di Esercizio
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Guide per la compilazione del regolamento di esercizio.
          </p>
        </div>
      </section>

      <Filters />
      <DocumentList />
    </>
  );
}

