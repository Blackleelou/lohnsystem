// src/pages/_app.tsx

import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import CookieBanner from "@/components/common/CookieBanner";
import "@/styles/globals.css"; // Tailwind-Stile aktivieren
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

function PromotedToAdminToast() {
  const { data: session, update } = useSession();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (session?.user?.promotedToAdmin && !shown) {
      toast.success("Du wurdest zum neuen Admin befördert! 🎉");
      // Flag zurücksetzen, damit der Toast nur einmal kommt
      fetch("/api/user/reset-promotion", { method: "POST" });
      setShown(true);
    }
  }, [session, shown]);

  return <Toaster position="top-right" />;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);

  return (
    <SessionProvider session={session}>
      <PromotedToAdminToast />
      {getLayout(<Component {...pageProps} />)}
      <CookieBanner />
    </SessionProvider>
  );
}
