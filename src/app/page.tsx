import { redirect } from "next/navigation";

// Server-side redirect to avoid client-side redirect issues in Google Search Console
export default function RootPage() {
  redirect("/it");
}
