"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bySchedaKey } from "@/data/product-data";

// 枚举值（按你的要求收敛）
const PRODUCT_TYPES = [
  { value: "pv-inverter", label: "PV Inverter" },
  { value: "batteria-accumulo", label: "Batteria di Accumulo" },
  { value: "all-in-one", label: "All in One" },
  { value: "ev-charger", label: "EV Charger" },
] as const;

const DOC_TYPES = [
  { value: "scheda-tecnica", label: "Scheda Tecnica" },
  { value: "manuale", label: "Manuale" },
  { value: "cei", label: "CEI-16 & CEI-021" },
  { value: "guida-regolamento", label: "Guida Regolamento di Esercizio" },
  { value: "garanzia", label: "Garanzia" },
] as const;

const LANGS = [
  { value: "it", label: "Italiano" },
  { value: "en", label: "English" },
] as const;

const REGIONS = [
  { value: "it", label: "Italia" },
  { value: "fr", label: "Francia" },
  { value: "es", label: "Spagna" },
] as const;

// 根据“产品类型”返回 “Serie/Modello” 选项
function getSeriesOptions(productType?: string) {
  if (!productType) return [];
  if (productType === "pv-inverter" || productType === "all-in-one") {
    return [
      { value: "monofase", label: "Monofase" },
      { value: "trifase", label: "Trifase" },
    ];
  }
  if (productType === "batteria-accumulo") {
    return [
      { value: "hailei", label: "Accumulo HAILEI consigliato da Afore" },
      { value: "afore", label: "Accumulo Afore" },
    ];
  }
  if (productType === "ev-charger") {
    return []; // 未来在这里补
  }
  return [];
}

// 根据"Serie/Modello"返回 "Potenza" 选项（等你给具体型号后再填）
function getPowerOptions(series?: string): Array<{ value: string; label: string }> {
  if (!series) return [];
  return [];
}

type FiltersProps = {
  highlightProduct?: string;
};

export default function Filters({ highlightProduct }: FiltersProps = {} as FiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  // 从 URL 初始化
  const [product, setProduct] = useState<string>(params.get("prodotto") ?? "");
  const [series, setSeries] = useState<string>(params.get("modello") ?? "");
  const [power, setPower] = useState<string>(params.get("potenza") ?? "");
  const [docType, setDocType] = useState<string>(params.get("tipo") ?? "");
  const [lang, setLang] = useState<string>(params.get("lingua") ?? "");
  const [region, setRegion] = useState<string>(params.get("regione") ?? "");

  // 联动候选项
  const seriesOptions = useMemo(() => getSeriesOptions(product), [product]);
  const powerOptions = useMemo(() => getPowerOptions(series), [series]);

  // 改变上游时清空下游
  const onProductChange = (v: string) => {
    setProduct(v);
    setSeries("");
    setPower("");
  };
  const onSeriesChange = (v: string) => {
    setSeries(v);
    setPower("");
  };

  // 应用筛选：把选项写入 URL
  const applyFilter = () => {
    const qs = new URLSearchParams();
    if (product) qs.set("prodotto", product);
    if (series) qs.set("modello", series);
    if (power) qs.set("potenza", power);
    if (docType) qs.set("tipo", docType);
    if (lang) qs.set("lingua", lang);
    if (region) qs.set("regione", region);
    router.push(`/documentazione?${qs.toString()}`);
  };

  // 还原
  const resetAll = () => {
    setProduct(""); setSeries(""); setPower("");
    setDocType(""); setLang(""); setRegion("");
    router.push(`/documentazione`);
  };

  const seriesDisabled = !product || seriesOptions.length === 0;
  const powerDisabled = !series || powerOptions.length === 0;

  // 处理 highlightProduct：如果有，自动设置筛选并滚动
  useEffect(() => {
    if (highlightProduct) {
      const productData = bySchedaKey[highlightProduct];
      if (productData) {
        // 根据产品类型设置筛选
        const hasInverter = productData.categories.some(c => c.slug === "inverter");
        const hasBatteria = productData.categories.some(c => c.slug === "batteria");
        const hasAllInOne = productData.categories.some(c => c.slug === "all-in-one");
        const hasEv = productData.categories.some(c => c.slug === "ev-charger");
        
        if (hasInverter || hasAllInOne) {
          setProduct(hasInverter ? "pv-inverter" : "all-in-one");
        } else if (hasBatteria) {
          setProduct("batteria-accumulo");
        } else if (hasEv) {
          setProduct("ev-charger");
        }
        
        // 设置文档类型为 scheda-tecnica
        setDocType("scheda-tecnica");
        
        // 延迟滚动，等待 DOM 更新
        setTimeout(() => {
          const element = document.getElementById(`product-${highlightProduct}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // 添加高亮效果
            element.classList.add("ring-4", "ring-brand-500", "ring-offset-2");
            setTimeout(() => {
              element.classList.remove("ring-4", "ring-brand-500", "ring-offset-2");
            }, 3000);
          }
        }, 500);
      }
    }
  }, [highlightProduct]);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-center text-xl md:text-2xl font-extrabold tracking-wide">
          DOWNLOAD RELATIVI AI PRODOTTI
        </h2>
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-brand-600" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tipo di prodotto */}
          <div>
            <label className="block text-sm mb-2 text-slate-700">Tipo di prodotto</label>
            <div className="relative">
              <select
                value={product}
                onChange={(e) => onProductChange(e.target.value)}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">SELEZIONA</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>

          {/* Serie / Modello */}
          <div className={seriesDisabled ? "opacity-60" : ""}>
            <label className="block text-sm mb-2 text-slate-700">Serie / Modello</label>
            <div className="relative">
              <select
                value={series}
                onChange={(e) => onSeriesChange(e.target.value)}
                disabled={seriesDisabled}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">SELEZIONA</option>
                {seriesOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>

          {/* Potenza */}
          <div className={powerDisabled ? "opacity-60" : ""}>
            <label className="block text-sm mb-2 text-slate-700">Potenza</label>
            <div className="relative">
              <select
                value={power}
                onChange={(e) => setPower(e.target.value)}
                disabled={powerDisabled}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">SELEZIONA</option>
                {powerOptions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>

          {/* Tipo di documento */}
          <div>
            <label className="block text-sm mb-2 text-slate-700">Tipo di documento</label>
            <div className="relative">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">SELEZIONA</option>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>

          {/* Lingua */}
          <div>
            <label className="block text-sm mb-2 text-slate-700">Lingua</label>
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">SELEZIONA</option>
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>

          {/* Regione */}
          <div>
            <label className="block text-sm mb-2 text-slate-700">Regione</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full appearance-none rounded-lg bg-white px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">SELEZIONA</option>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-lg border border-slate-300 px-5 py-2 font-semibold hover:bg-slate-50"
          >
            Ripristina
          </button>
          <button
            type="button"
            onClick={applyFilter}
            className="rounded-lg bg-brand-600 text-white px-6 py-2 font-semibold hover:bg-brand-500"
          >
            Filtra
          </button>
        </div>
      </div>
    </section>
  );
}
