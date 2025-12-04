"use client";

import { useEffect } from "react";

// For static export, we need client-side redirect
// This is the only way redirects work in static sites
export default function RootPage() {
  useEffect(() => {
    // Set meta refresh tag as fallback
    const metaRefresh = document.createElement("meta");
    metaRefresh.httpEquiv = "refresh";
    metaRefresh.content = "0; url=/it";
    document.head.appendChild(metaRefresh);

    // Set canonical link
    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = "https://www.afore.it/it";
    document.head.appendChild(canonicalLink);

    // Immediate redirect to /it
    window.location.replace("/it");

    return () => {
      // Cleanup
      document.head.removeChild(metaRefresh);
      document.head.removeChild(canonicalLink);
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif',
      color: '#333'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Redirecting to <a href="/it" style={{ color: '#0066cc' }}>Italian version</a>...</p>
      </div>
    </div>
  );
}
