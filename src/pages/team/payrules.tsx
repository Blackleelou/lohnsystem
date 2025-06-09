// src/pages/team/payrules.tsx

import { useEffect, useState } from 'react';
import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function PayrulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (session?.user?.companyId === null) {
      router.replace('/dashboard');
      return;
    }

    // Hier später API-Daten laden
    setLoading(false);
  }, [status]);

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Lohnregeln</h1>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Lohnregeln…</div>
        ) : (
          <div className="text-center text-gray-400 italic">
            Noch keine Lohnregeln hinterlegt.
          </div>
        )}
      </div>
    </TeamLayout>
  );
}
