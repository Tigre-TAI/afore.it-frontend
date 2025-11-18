type PageIntroProps = {
  title: string;
  description: string;
  bullets?: string[];
  eyebrow?: string;
};

export default function PageIntro({
  title,
  description,
  bullets = [],
  eyebrow = "Documentazione",
}: PageIntroProps) {
  return (
    <section className="py-16 border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl lg:text-4xl font-black text-slate-900">
          {title}
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          {description}
        </p>
        {bullets.length > 0 && (
          <ul className="mt-6 space-y-2 text-slate-700 list-disc pl-5">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}


