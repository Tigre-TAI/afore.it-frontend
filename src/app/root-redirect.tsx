"use client";

import { useEffect } from "react";

// Client component for redirect (required for static export)
export default function RootRedirect() {
  useEffect(() => {
    // Immediate redirect to /it
    window.location.replace("/it");
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

