// src/pages/team/index.tsx

import Layout from "@/components/common/Layout";
import TeamSidebar from "@/components/team/TeamSidebar"; // Importiere die Sidebar!
import { useEffect, useState } from "react";

type Team = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export default function TeamOverviewPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team/me")
      .then(res => res.json())
      .then(data => {
        setTeam(data.team);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="flex max-w-4xl mx-auto py-12">
        <TeamSidebar />
        <main className="flex-1 pl-0 md:pl-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8">
            {loading ? (
              <div>Lade Teamdaten…</div>
            ) : team ? (
              <>
                <h1 className="text-2xl font-bold text-blue-700 mb-2">{team.name}</h1>
                {team.description && (
                  <div className="mb-3 text-gray-600 dark:text-gray-300">{team.description}</div>
                )}
                <div className="text-xs text-gray-400 mb-6">
                  Angelegt am: {new Date(team.createdAt).toLocaleString()}
                </div>
                <div className="mt-10 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  Hier folgt bald die Teamverwaltung (Rollen, Einladungen, Einstellungen …)
                </div>
              </>
            ) : (
              <div>Kein Team gefunden.</div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
