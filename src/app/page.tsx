import type { Metadata } from "next";
import RootRedirect from "./root-redirect";

// For static export, we need to set canonical and redirect
// Since we can't use server-side redirect in static export, we use metadata + client redirect
export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.afore.it/it",
  },
  robots: {
    index: false, // Don't index the root page, only /it
    follow: true,
  },
};

export default function RootPage() {
  return <RootRedirect />;
}
