"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";
import {
  hasCookieConsent,
  setCookiePreferences,
  acceptAllCookies,
  rejectAllCookies,
  getCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookies";

// Export function to open cookie settings from outside
// This allows other components to trigger the cookie settings modal
let openCookieSettingsCallback: (() => void) | null = null;

export function openCookieSettings() {
  if (openCookieSettingsCallback) {
    openCookieSettingsCallback();
  } else {
    // If component not mounted yet, try again after a short delay
    setTimeout(() => {
      if (openCookieSettingsCallback) {
        openCookieSettingsCallback();
      }
    }, 100);
  }
}

export default function CookieConsent() {
  const { t, lang } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  // Register callback to open settings from outside
  useEffect(() => {
    openCookieSettingsCallback = () => {
      setShowSettings(true);
    };
    return () => {
      openCookieSettingsCallback = null;
    };
  }, []);

  useEffect(() => {
    // 检查用户是否已经同意Cookie
    const hasConsent = hasCookieConsent();
    if (!hasConsent) {
      // Defer cookie banner to reduce INP - wait for page to be interactive
      // Use requestIdleCallback if available, otherwise setTimeout with longer delay
      const showBanner = () => setShowBanner(true);
      
      if ('requestIdleCallback' in window) {
        const idleId = (window as any).requestIdleCallback(showBanner, { timeout: 3000 });
        return () => {
          if ('cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(idleId);
          }
        };
      } else {
        // Fallback: wait 2 seconds after page load
        const timer = setTimeout(showBanner, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    // 加载已保存的偏好设置
    const savedPrefs = getCookiePreferences();
    setPreferences(savedPrefs);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setShowBanner(false);
    setShowSettings(false);
  };

  // Accetta solo necessari = same as reject all (only necessary cookies)
  const handleAcceptOnlyNecessary = () => {
    rejectAllCookies();
    setShowBanner(false);
    setShowSettings(false);
  };

  // Close (X) = continue with only necessary cookies
  const handleClose = () => {
    rejectAllCookies();
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    setCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleTogglePreference = (type: keyof CookiePreferences) => {
    // 必要Cookie不能关闭
    if (type === 'necessary') return;
    
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Consent Modal (centered, like reference) */}
      {showBanner && !showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative bg-white max-w-lg w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (X) = continue with only necessary */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 transition-colors"
              aria-label={t("common.close")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 pr-10">
              {t("cookie.title")}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {t("cookie.description")}
            </p>

            {/* Buttons: Accetta tutto + Accetta solo necessari */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAcceptAll}
                variant="primary"
                className="w-full justify-center"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t("cookie.acceptAll")}
              </Button>
              <Button
                onClick={handleAcceptOnlyNecessary}
                variant="secondary"
                trailingChevron={false}
                className="w-full justify-center"
              >
                {t("cookie.acceptOnlyNecessary")}
              </Button>
            </div>

            {/* Opzioni link */}
            <Button
              onClick={handleOpenSettings}
              variant="secondary"
              trailingChevron={false}
              className="mt-4 text-sm"
            >
              {t("cookie.options")}...
            </Button>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 transition-colors"
              aria-label={t("common.close")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {t("cookie.settingsTitle")}
                </h2>
                <p className="text-sm text-gray-600">
                  {t("cookie.settingsDescription")}
                </p>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t("cookie.necessary.title")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("cookie.necessary.description")}
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                        <input
                          type="checkbox"
                          checked={preferences.necessary}
                          disabled
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-brand-600 rounded-full"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t("cookie.analytics.title")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("cookie.analytics.description")}
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C01C20]/40 peer-focus:ring-offset-1 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t("cookie.marketing.title")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("cookie.marketing.description")}
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C01C20]/40 peer-focus:ring-offset-1 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t("cookie.functional.title")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("cookie.functional.description")}
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => handleTogglePreference('functional')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C01C20]/40 peer-focus:ring-offset-1 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Accept first with icon */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleAcceptAll}
                  variant="primary"
                  className="flex-1 justify-center"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("cookie.acceptAll")}
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="secondary"
                  trailingChevron={false}
                  className="flex-1 justify-center"
                >
                  {t("cookie.rejectAll")}
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  variant="primary"
                  trailingChevron={false}
                  className="flex-1 justify-center"
                >
                  {t("cookie.savePreferences")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

