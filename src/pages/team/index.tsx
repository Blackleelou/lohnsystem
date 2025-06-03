// src/pages/team/index.tsx

import Layout from "@/components/common/Layout";
import { useEffect, useState } from "react";

type Team = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};
type Member = {
  id: string;
  name?: string;
  nickname?: string;
  email: string;
};

export default function TeamOverviewPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team/me")
      .then(res => res.json())
      .then(data => {
        setTeam(data.team);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch("/api/team/members")
      .then(res => res.json())
      .then(data => setMembers(data.members || []))
      .catch(() => setMembers([]));
  }, []);

  // Team löschen Handler
  const handleDelete = async () => {
    if (!window.confirm("Willst du dieses Team wirklich löschen? Das kann nicht rückgängig gemacht werden!")) return;
    setDeleting(true);
    setError(null);
    const res = await fetch("/api/team", { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Fehler beim Löschen des Teams.");
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
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

            {/* Mitglieder-Vorschau */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-4 mb-4">
              <h2 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-2">Teammitglieder</h2>
              {members.length > 0 ? (
                <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                  {members.map((m) => (
                    <li key={m.id}>
                      {m.nickname ? (
                        <span>
                          <b>{m.nickname}</b> <span className="text-xs text-gray-500">({m.name || m.email})</span>
                        </span>
                      ) : (
                        <span>{m.name || m.email}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-500">Noch keine Mitglieder geladen.</div>
              )}
            </div>

            {/* TEAM LÖSCHEN */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2 text-red-600">Team löschen</h2>
              <p className="text-sm text-gray-500 mb-3">
                Achtung: Das Team wird dauerhaft entfernt. Alle Nutzer kehren automatisch in den Solo-Modus zurück.
              </p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Lösche…" : "Team unwiderruflich löschen"}
              </button>
              {error && <div className="mt-3 text-red-500">{error}</div>}
            </div>

            <div className="mt-10 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              Hier folgt bald die Teamverwaltung (Rollen, Einladungen, Einstellungen …)
            </div>
          </>
        ) : (
          <div>Kein Team gefunden.</div>
        )}
      </div>
    </Layout>
  );
}
