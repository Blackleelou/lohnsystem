// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import CookieBanner from "@/components/common/CookieBanner";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Script from "next/script";

// ✅ Erfolgsmeldung bei Admin-Beförderung
function PromotedToAdminToast() {
  const { data: session, update } = useSession();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (session?.user?.promotedToAdmin && !shown) {
      toast.success("Du wurdest zum neuen Admin befördert! 🎉", { id: "promotion-toast" });
      fetch("/api/user/reset-promotion", { method: "POST" });
      setShown(true);
    }
  }, [session, shown]);

  return null;
}

// 🔁 Session-Update alle 30 Sekunden (z. B. Rollenwechsel)
function SessionRefresher() {
  const { update, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const interval = setInterval(() => {
      update(); // prüft z. B. neue Rolle
    }, 30000);
    return () => clearInterval(interval);
  }, [status, update]);

  return null;
}

// 📊 Analytics nur bei Zustimmung (aus Cookie-Einstellung)
function AnalyticsScript() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}");
      if (consent.statistik === true) {
        setEnabled(true);
      }
    } catch {
      // JSON ungültig – kein Tracking
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BHB7SNG99H"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BHB7SNG99H', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);

  return (
    <SessionProvider session={session}>
      <Toaster position="top-center" />
      <PromotedToAdminToast />
      <SessionRefresher />
      <AnalyticsScript />
      {getLayout(<Component {...pageProps} />)}
      <CookieBanner />
    </SessionProvider>
  );
}
