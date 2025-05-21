// Datei: pages/_app.tsx

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import CookieBanner from "@/components/CookieBanner";
import "@/styles/globals.css"; // Tailwind-Stile aktivieren

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
      <CookieBanner />
    </SessionProvider>
  );
}
