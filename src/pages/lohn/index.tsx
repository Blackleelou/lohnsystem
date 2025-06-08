// src/pages/lohn/index.tsx

import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/common/Layout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Server Side: Auth prüfen (aber kein Redirect wegen Team!)
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Seite immer anzeigen, egal ob Team oder Solo.
  return { props: {} };
};

export default function LohnUebersicht() {
  const { data: session } = useSession();
  const [teamInfo, setTeamInfo] = useState<{ name?: string; description?: string } | null>(null);

  // Wenn User im Team: Teamdaten per API holen (damit auch Name & Beschreibung sichtbar sind)
  useEffect(() => {
    if (session?.user?.companyId) {
      fetch('/api/team/me')
        .then((res) => res.json())
        .then((data) => setTeamInfo(data?.team ?? null))
        .catch(() => setTeamInfo(null));
    }
  }, [session?.user?.companyId]);

  const isTeam = !!session?.user?.companyId;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          Mein Lohn & Auswertung
        </h1>
        {isTeam && teamInfo && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-900 dark:text-blue-200">
            <strong>Team-Modus aktiv:</strong>
            <br />
            Du bist Teil des Teams <span className="font-semibold">{teamInfo.name}</span>
            {teamInfo.description && (
              <>
                <br />
                <span className="text-gray-600 dark:text-gray-400">{teamInfo.description}</span>
              </>
            )}
            <br />
            <Link href="/team" className="text-blue-700 underline font-semibold">
              Zur Team-Übersicht
            </Link>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400">
          Hier siehst du bald alle Schichten, Lohnabrechnungen und Auswertungen auf einen Blick.
        </p>
        <div className="mt-8 text-gray-400">[Demo-Ansicht – Inhalte folgen!]</div>
      </div>
    </Layout>
  );
}
