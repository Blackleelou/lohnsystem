
ANLEITUNG:

1. Füge die Datei 'components/CookieBanner.tsx' in dein Projekt ein.
2. Öffne 'pages/_app.tsx' und füge <CookieBanner /> ganz unten in den JSX-Return-Block ein:

  import CookieBanner from "@/components/CookieBanner";

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
      <CookieBanner />  // <== HIER EINFÜGEN
    </SessionProvider>

3. Der Banner wird nur angezeigt, wenn noch keine Zustimmung erfolgt ist (via localStorage).

Hinweis:
- Keine externe Cookie-Verwaltung nötig.
- DSGVO-optimiert für grundlegende Session-Nutzung.
