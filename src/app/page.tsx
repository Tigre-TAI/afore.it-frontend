import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Afore Italia - Redirecting",
};

export default function RootPage() {
  return (
    <>
      {/* Meta refresh for immediate redirect without JavaScript */}
      <meta httpEquiv="refresh" content="0; url=/it" />
      <link rel="canonical" href="/it" />
      
      {/* Immediate JavaScript redirect as fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var redirect = '/it';
              if (window.location.pathname !== redirect) {
                window.location.replace(redirect);
              }
            })();
          `,
        }}
      />
      
      {/* Fallback content for users without JavaScript */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center'
      }}>
        <div>
          <p>Redirecting to Italian version...</p>
          <a href="/it" style={{ color: '#0066cc', textDecoration: 'underline' }}>
            Click here if you are not redirected
          </a>
        </div>
      </div>
    </>
  );
}
