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

export default async function GuidaPage() {
  const documents = await scanDocumentazioneDirectory();
  
  return (
    <main>
      <PageIntro
        title="Guida Regolamento di Esercizio"
        description="Procedure ufficiali per completare correttamente regolamenti, addendum tecnici e verifiche di conformità."
        bullets={[
          "Template aggiornati per RDE",
          "Addendum tecnici per impianti monofase e trifase",
          "Test verification of conformity",
        ]}
      />
      <DocumentList documents={documents} docTypeFilter="guida-regolamento" />
    </main>
  );
}

