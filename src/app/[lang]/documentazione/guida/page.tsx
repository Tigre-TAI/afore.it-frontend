import DocumentList from "../_components/DocumentList";
import PageIntro from "../_components/PageIntro";

export default function GuidaPage() {
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
      <DocumentList docTypeFilter="guida-regolamento" />
    </main>
  );
}

