// src/pages/team/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout';

type Team = {
  id: string;
  name: string;
  description?: string;
  users: { id: string; name?: string | null; email: string }[];
};

export default function TeamDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/team/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Layout>
        <div className="p-8 text-center">Lade Teamdaten…</div>
      </Layout>
    );
  if (!team)
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">Team nicht gefunden.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">{team.name}</h1>
        {team.description && (
          <div className="mb-4 text-gray-600 dark:text-gray-300">{team.description}</div>
        )}
        <div className="mt-6">
          <b>Mitglieder:</b>
          <ul className="mt-2 list-disc pl-5">
            {team.users.map((u) => (
              <li key={u.id}>
                {u.name ? `${u.name} ` : ''}
                <span className="text-gray-500">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
