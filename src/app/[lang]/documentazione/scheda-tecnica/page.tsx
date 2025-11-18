import Breadcrumb from "@/components/ui/Breadcrumbs";
import Filters from "../_components/Filters";
import DocumentList from "../_components/DocumentList";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";

type Props = {
  params: Promise<{ lang: string }>;
};

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

export default async function SchedaTecnicaPage({ params }: Props) {
  const { lang } = await params;
  // For static export, searchParams are handled client-side via URL params in DocumentList
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 pt-16">
        <div className="absolute inset-0">
          <img
            src="/image/documentazione_hero.jpg"
            alt="Scheda Tecnica"
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
              { label: "Scheda Tecnica" },
            ]}
          />
          <h1 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
            Scheda Tecnica
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Scarica le schede tecniche complete dei nostri prodotti.
          </p>
        </div>
      </section>

      {/* Filters 和 DocumentList 分开，Filters 在上，DocumentList 在下 */}
      <Filters />
      <DocumentList documents={documents} />
    </>
  );
}

