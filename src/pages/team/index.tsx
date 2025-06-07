// src/pages/team/index.tsx

import Layout from "@/components/common/Layout";
import { useState, useEffect } from "react";

type Team = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export default function TeamDashboardPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team/me")
      .then(res => res.json())
      .then(data => {
        if (!data.team) {
          window.location.href = "/dashboard";
        } else {
          setTeam(data.team);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
        {loading ? (
          <div>Lade Teamdaten…</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-2">{team?.name}: Lohnübersicht</h1>
            {team?.description && (
              <div className="mb-3 text-gray-600 dark:text-gray-300">{team.description}</div>
            )}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded mt-8">
              <b>Team-Lohnübersicht:</b><br />
              <div className="mt-2 text-gray-500">
                Hier erscheinen später alle gemeinsamen Schichten, Lohnabrechnungen und Team-Auswertungen.
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
