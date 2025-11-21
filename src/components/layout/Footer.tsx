"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLangFromPath, withLang } from "@/lib/lang-utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const pathname = usePathname();
  const lang = getLangFromPath(pathname);
  const { t } = useTranslation();
  return (
    <footer className="bg-black text-gray-300">
      {/* 上区：移动端 Logo 单独一行，桌面端左 logo + 右四列 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
          {/* Logo：移动端单独一行靠左，桌面端左侧固定宽度 */}
          <div className="w-full md:shrink-0 md:w-40 flex justify-start">
            <Image
              src="/logos/logo_afore_light.png"
              alt="Afore Logo"
              width={120}
              height={36}
              className="opacity-95"
              unoptimized
            />
          </div>

          {/* 右侧：四列信息；移动端 2 列，桌面端 4 列 */}
          <div className="w-full md:ml-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-sm">
            {/* Col 1 - Afore */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.afore')}</h3>
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
                  <Link href={withLang("/garanzia", lang)} className="hover:text-white transition-colors">
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
                <li className="text-gray-400">
                  {t('footer.address')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 下区：版权 + 社交；同一容器以保证左右对齐 */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>{t('footer.copyright', { year: new Date().getFullYear().toString() })}</p>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a 
              href="https://wa.me/393513399999" 
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
