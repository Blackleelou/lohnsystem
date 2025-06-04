// src/pages/team/index.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import TeamSidebar from "@/components/team/TeamSidebar";
import { useSession } from "next-auth/react";

// Typen für Team & Mitglieder
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
  const { data: session, status, update } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Teamdaten & Mitglieder laden
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.companyId) {
      router.replace("/dashboard");
      return;
    }
    setLoading(true);
    fetch("/api/team/me")
      .then(res => res.json())
      .then(data => setTeam(data.team))
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));

    // Mitglieder laden
    fetch("/api/team/members")
      .then(res => res.json())
      .then(data => setMembers(data.members || []))
      .catch(() => setMembers([]));
  }, [session, status, router]);

  // Team löschen Handler
  const handleDelete = async () => {
    if (!confirm("Willst du dieses Team wirklich löschen? Das kann nicht rückgängig gemacht werden!")) return;
    setDeleting(true);
    setError(null);
    const res = await fetch("/api/team", { method: "DELETE" });
    if (res.ok) {
      if (typeof update === "function") {
        await update();
      }
      router.replace("/dashboard");
    } else {
      setError("Fehler beim Löschen des Teams.");
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="flex max-w-4xl mx-auto py-12">
        <TeamSidebar />
        <main className="flex-1 pl-8">
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
                {/* Mitgliederliste */}
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
                {/* Hinweis & Team löschen Button */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded mb-8">
                  Willkommen in deinem Team! Über das Menü links kannst du weitere Bereiche aufrufen.
                </div>
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
