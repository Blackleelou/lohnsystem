// src/pages/team/files.tsx

import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TeamFilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.companyId === null) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  return (
    <TeamLayout>
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Dateiverwaltung</h1>
        <div className="text-gray-600 dark:text-gray-300">
          Hier kannst du später Dokumente, Abrechnungen oder andere Dateien für dein Team verwalten und hochladen.
        </div>
      </div>
    </TeamLayout>
  );
}
