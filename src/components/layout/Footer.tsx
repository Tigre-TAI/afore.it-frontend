"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLangFromPath, withLang } from "@/lib/lang-utils";
import { useTranslation } from "@/hooks/useTranslation";
import { openCookieSettings } from "@/components/CookieConsent";

export default function Footer() {
  const pathname = usePathname();
  const lang = getLangFromPath(pathname);
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
          <div className="w-full md:shrink-0 md:w-36 flex justify-start">
            <Image
              src="/logos/logo_afore_light.png"
              alt="Afore Logo"
              width={120}
              height={36}
              className="opacity-90"
              unoptimized
              loading="lazy"
            />
          </div>
          <div className="w-full md:ml-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-sm">
            {/* Col 1 - Afore */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-[15px]">{t('footer.afore')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={withLang("/", lang)} className="hover:text-white transition-colors">
                    {t('common.home')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/prodotti", lang)} className="hover:text-white transition-colors">
                    {t('footer.prodotti')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/documentazione", lang)} className="hover:text-white transition-colors">
                    {t('footer.documentazione')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/eventi", lang)} className="hover:text-white transition-colors">
                    {t('footer.eventi')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/assistenza", lang)} className="hover:text-white transition-colors">
                    {t('footer.garanzia')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2 - Prodotti */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.prodotti')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={withLang("/prodotti/pv-inverter", lang)} className="hover:text-white transition-colors">
                    PV Inverter
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/prodotti/batteria-di-accumulo", lang)} className="hover:text-white transition-colors">
                    Batteria di Accumulo
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/prodotti/allin1", lang)} className="hover:text-white transition-colors">
                    All in One
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/prodotti/ev-charger", lang)} className="hover:text-white transition-colors">
                    EV Charger
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 - Documentazione */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.documentazione')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={withLang("/documentazione/certificati-inverter-di-stringa", lang)} className="hover:text-white transition-colors">
                    {t('documentazione.certificatiInverterStringa.title')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/documentazione/certificati-inverter-ibridi", lang)} className="hover:text-white transition-colors">
                    {t('documentazione.certificatiInverterIbridi.title')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/documentazione/accumulo-afore", lang)} className="hover:text-white transition-colors">
                    {t('documentazione.accumuloAfore.title')}
                  </Link>
                </li>
                <li>
                  <Link href={withLang("/documentazione/certificati-all-in-one", lang)} className="hover:text-white transition-colors">
                    {t('documentazione.certificatiAllInOne.title')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 - Contatti */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.contatti')}</h3>
              <ul className="space-y-2 text-xs">
                <li>Email: afore@aforeitaly.com</li>
                <li>Office: +39 06 40419655</li>
                <li>Tel: +39 351 3399999</li>
                <li>{t('footer.afterSales')}</li>
                <li className="text-slate-400">
                  {t('footer.address')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between text-sm gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>{t('footer.copyright', { year: new Date().getFullYear().toString() })}</p>
            <button
              onClick={() => openCookieSettings()}
              className="text-slate-400 hover:text-slate-200 transition-colors underline text-xs md:text-sm"
            >
              {t('cookie.manageCookies')}
            </button>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a 
              href="https://wa.me/393513399999" 
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://www.tiktok.com/@afore.italia?is_from_webapp=1&sender_device=pc" 
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_tiktok.svg"
                alt="TikTok"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://x.com/aforeitalia" 
              aria-label="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_x.svg"
                alt="X"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61570302226961" 
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://www.instagram.com/afore.italia/" 
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://www.youtube.com/@aforeitalia" 
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_youtube.svg"
                alt="YouTube"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
            <a 
              href="https://it.linkedin.com/company/afore-italia" 
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src="/image/social/social_linkedin.svg"
                alt="LinkedIn"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
