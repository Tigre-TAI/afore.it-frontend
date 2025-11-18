/** 预渲染所有语言版本的页面（静态导出必需） */
export async function generateStaticParams() {
  return [
    { lang: "it" },
    { lang: "en" },
    { lang: "es" },
  ];
}

export default function ProdottiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

