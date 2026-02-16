export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

export default function RicercaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
