import DocumentList from "../_components/DocumentList";
import PageIntro from "../_components/PageIntro";
import { scanDocumentazioneDirectory } from "@/lib/document-utils";

/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

export default async function ArchivioPage() {
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <main>
      <PageIntro
        title="Archivio Documentazione"
        description="Archivio completo di certificazioni, manuali, schede tecniche e report ufficiali sempre accessibili."
        bullets={[
          "Storico completo dei documenti pubblicati",
          "Download rapidi in formato originale",
          "Aggiornamenti costanti a cura del team tecnico",
        ]}
      />
      <DocumentList documents={documents} />
    </main>
  );
}

