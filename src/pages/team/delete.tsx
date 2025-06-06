// src/pages/team/delete.tsx

import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import TeamLayout from "@/components/team/TeamLayout";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function TeamDeletePage() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/delete", {
        method: "POST",
      });

      if (res.ok) {
        await update();
        toast.success("Das Team wurde erfolgreich gelöscht.");
        router.replace("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Unbekannter Fehler beim Löschen.");
      }
    } catch (err) {
      toast.error("Fehler beim Senden der Anfrage.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <TeamLayout>
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-red-600">Team unwiderruflich löschen</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Wenn du fortfährst, wird das Team dauerhaft gelöscht und alle Mitglieder wechseln automatisch in den Solo-Modus.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Lösche..." : "Team löschen"}
        </button>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Team wirklich löschen?
            </h3>
            <p className="text-sm text-red-500 mb-4">
              Möchtest du dieses Team dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Lösche..." : "Ja, löschen"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                disabled={loading}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}
