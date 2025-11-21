"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
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
      // 延迟显示，让页面先加载
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
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
      {/* Cookie Consent Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t-2 border-brand-600 shadow-2xl transform transition-all duration-300 ease-out">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {t("cookie.title")}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-2">
                  {t("cookie.description")}
                </p>
                <button
                  onClick={handleOpenSettings}
                  className="text-sm text-brand-600 hover:text-brand-700 font-semibold underline"
                >
                  {t("cookie.customize")}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  {t("cookie.acceptAll")}
                </button>
              </div>
            </div>
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Close"
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                >
                  {t("cookie.acceptAll")}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t("cookie.savePreferences")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

