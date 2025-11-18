import DocumentList from "../_components/DocumentList";
import PageIntro from "../_components/PageIntro";

export default function ArchivioPage() {
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
      <DocumentList />
    </main>
  );
}

