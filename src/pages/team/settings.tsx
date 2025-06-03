// src/pages/team/settings.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import { useSession } from "next-auth/react";

export default function TeamSettings() {
  const { data: session, status } = useSession();
  const [team, setTeam] = useState<{ name: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Teamdaten laden
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.companyId) {
      router.replace("/dashboard");
      return;
    }
    setLoading(true);
    fetch("/api/team/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.name) router.replace("/dashboard");
        else setTeam(data);
      })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [session, status, router]);

  // Team löschen Handler
  const handleDelete = async () => {
    if (!confirm("Willst du dieses Team wirklich löschen? Das kann nicht rückgängig gemacht werden!")) return;
    setDeleting(true);
    setError(null);
    const res = await fetch("/api/team", { method: "DELETE" });
    if (res.ok) {
      // Nach dem Löschen ins Dashboard zurück
      router.replace("/dashboard");
    } else {
      setError("Fehler beim Löschen des Teams.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-16 text-center text-gray-500">Lade Teamdaten…</div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-16 text-center text-gray-500">
          Kein Team gefunden.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Team-Einstellungen</h1>
        <div className="mb-6">
          <div className="font-semibold text-lg">{team.name}</div>
          {team.description && <div className="text-gray-500">{team.description}</div>}
        </div>

        <div className="mt-10">
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
      </div>
    </Layout>
  );
}
