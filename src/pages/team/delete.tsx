// src/pages/team/delete.tsx

import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import TeamLayout from "@/components/team/TeamLayout";

export default function TeamDeletePage() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Willst du dieses Team wirklich löschen? Das kann nicht rückgängig gemacht werden!"
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/delete", {
        method: "POST",
      });

      if (res.ok) {
        await update(); // Session-Daten aktualisieren (z. B. companyId: null)
        router.replace("/dashboard"); // Direkt ins Dashboard weiterleiten
      } else {
        const data = await res.json();
        setError(data.error || "Unbekannter Fehler beim Löschen.");
      }
    } catch (err) {
      setError("Fehler beim Senden der Anfrage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeamLayout>
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-red-600">Team unwiderruflich löschen</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Wenn du fortfährst, wird das Team dauerhaft gelöscht und alle Mitglieder wechseln automatisch in den Solo-Modus.
        </p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Lösche..." : "Team löschen"}
        </button>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </TeamLayout>
  );
}
