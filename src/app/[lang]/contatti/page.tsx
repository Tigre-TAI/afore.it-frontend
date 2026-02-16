"use client";

import { useState, useRef } from "react";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import SocialPressSidebar from "@/components/SocialPressSidebar";
import { useTranslation } from "@/hooks/useTranslation";
import HeroBackground from "@/components/ui/HeroBackground";
import { CONTACT_FORM_ACTION } from "@/data/contact-form";

const MAX_FILES = 10;
const ACCEPT_TYPES = "image/jpeg,image/png,.jpg,.jpeg,.png";

export default function ContattiPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!CONTACT_FORM_ACTION) {
      setSubmitted(true);
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("name", (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "");
    formData.append("phone", (form.querySelector('[name="phone"]') as HTMLInputElement)?.value ?? "");
    formData.append("email", (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "");
    formData.append("category", (form.querySelector('[name="category"]:checked') as HTMLInputElement)?.value ?? "");
    formData.append("reason", (form.querySelector('[name="reason"]') as HTMLTextAreaElement)?.value ?? "");
    formData.append("_subject", "Richiesta di contatto - Afore");
    files.forEach((file) => formData.append("images", file));
    try {
      const res = await fetch(CONTACT_FORM_ACTION, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSubmitted(true);
        setFiles([]);
        form.reset();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || t("contatti.form.submitError"));
      }
    } catch {
      setSubmitError(t("contatti.form.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    if (valid.length !== selected.length) {
      setUploadError(t("contatti.form.uploadErrorType"));
    }
    const combined = [...files, ...valid].slice(0, MAX_FILES);
    if (combined.length > MAX_FILES) {
      setUploadError(t("contatti.form.uploadErrorMax"));
    }
    setFiles(combined.slice(0, MAX_FILES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <section className="relative -mt-[88px] pt-[88px]">
        <HeroBackground src="/image/heroes/contatti_hero.jpg" alt={t("contatti.title")} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-white">
          <Breadcrumb
            theme="dark"
            items={[
              { label: t("common.breadcrumb.home"), href: "/" },
              { label: t("contatti.title") },
            ]}
          />
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
            {t("contatti.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {t("contatti.subtitle")}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-[#F5F6F7] py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 min-w-0 py-6 lg:pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#111827] mb-4">
                {t("contatti.form.title")}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    {t("contatti.form.name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder={t("contatti.form.namePlaceholder")}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C01C20]/20 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    {t("contatti.form.phone")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder={t("contatti.form.phonePlaceholder")}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C01C20]/20 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    {t("contatti.form.email")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("contatti.form.emailPlaceholder")}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C01C20]/20 transition-colors"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contatti.form.categoryLabel")} <span className="text-red-500">*</span>
                  </span>
                  <div className="space-y-1.5">
                    {(["installatori", "commerciali", "installatoriCommerciali", "clientiFinali"] as const).map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={value}
                          required
                          className="w-4 h-4 text-[#C01C20] border-slate-300 focus:ring-[#C01C20]"
                        />
                        <span className="text-slate-700">{t(`contatti.${value}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-reason"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    {t("contatti.form.reason")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-reason"
                    name="reason"
                    required
                    rows={3}
                    placeholder={t("contatti.form.reasonPlaceholder")}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-[#C01C20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C01C20]/20 transition-colors resize-y min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t("contatti.form.uploadLabel")}
                  </label>
                  <p className="text-xs text-slate-500 mb-1">
                    {t("contatti.form.uploadHint")}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_TYPES}
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {uploadError && (
                    <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                  )}
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {files.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-md"
                        >
                          <span className="truncate text-slate-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="ml-2 text-red-600 hover:text-red-700 font-medium shrink-0"
                          >
                            {t("contatti.form.uploadRemove")}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {submitError && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg">
                    {submitError}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="touch-manipulation"
                  disabled={submitting}
                >
                  {submitting ? t("contatti.form.submitting") : t("contatti.form.submit")}
                </Button>
                {submitted && (
                  <p className="mt-1.5 text-sm text-[#059669] font-medium">
                    {CONTACT_FORM_ACTION ? t("contatti.form.success") : "Configura NEXT_PUBLIC_CONTACT_FORM_ACTION (es. Formspree) per abilitare l'invio."}
                  </p>
                )}
              </form>
            </div>
            <SocialPressSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
