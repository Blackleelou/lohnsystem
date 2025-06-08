// pages/admin/index.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), { ssr: false });

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Warten bis geladen
    if (!session || session.user?.email !== 'jantzen.chris@gmail.com') {
      router.replace('/login'); // Oder "/" wenn gewünscht
    }
  }, [session, status, router]);

  if (status === 'loading') return <div>Lade...</div>;
  if (!session || session.user?.email !== 'jantzen.chris@gmail.com') return null;

  return <AdminPanel />;
}
