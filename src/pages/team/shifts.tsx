// src/pages/team/shifts.tsx

import TeamLayout from '@/components/team/TeamLayout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function TeamShiftsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!session?.user?.companyId) {
      router.replace('/dashboard');
      return;
    }

    // Später hier Daten für Schichten laden
    setLoading(false);
  }, [status, session, router]);

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Team-Schichten</h1>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Schichten…</div>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            Hier erscheinen später alle erfassten Schichten.
          </div>
        )}
      </div>
    </TeamLayout>
  );
}
