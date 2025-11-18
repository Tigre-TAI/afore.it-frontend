import Breadcrumb from "@/components/ui/Breadcrumbs";
import Filters from "../_components/Filters";
import DocumentList from "../_components/DocumentList";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

export default async function ManualePage() {
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Manuale"
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
              { label: "Manuale" },
            ]}
          />
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            Manuale
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Consulta i manuali d'uso e installazione dei nostri prodotti.
          </p>
        </div>
      </section>

      <Filters />
      <DocumentList documents={documents} />
    </>
  );
}

