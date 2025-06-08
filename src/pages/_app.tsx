// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import CookieBanner from '@/components/common/CookieBanner';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function PromotedToAdminToast() {
  const { data: session, update } = useSession();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (session?.user?.promotedToAdmin && !shown) {
      toast.success('Du wurdest zum neuen Admin befördert! 🎉', { id: 'promotion-toast' });
      fetch('/api/user/reset-promotion', { method: 'POST' });
      setShown(true);
    }
  }, [session, shown]);

  return null;
}

// 🔁 NEU: Session regelmäßig aktualisieren (z. B. bei Rollenänderung)
function SessionRefresher() {
  const { update, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;

    const interval = setInterval(() => {
      update(); // holt z. B. neue Rolle
    }, 30000); // alle 30 Sekunden

    return () => clearInterval(interval);
  }, [status, update]);

  return null;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);

  return (
    <SessionProvider session={session}>
      <Toaster position="top-center" />
      <PromotedToAdminToast />
      <SessionRefresher /> {/* <-- NEU eingefügt */}
      {getLayout(<Component {...pageProps} />)}
      <CookieBanner />
    </SessionProvider>
  );
}
