// src/pages/user/team.tsx

import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function TeamSettingsPage() {
  const { data: session, update } = useSession() // mit refetch-Option (update)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const leaveTeam = async () => {
    setLoading(true);
    const res = await fetch("/api/team/leave", { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setShowConfirm(false);
      // Session sofort neu laden, damit das Menü aktualisiert wird
      await fetch("/api/auth/session?update");
      alert("Du bist jetzt aus dem Team ausgetreten.");
      router.push("/dashboard") // Optional: router.push("/dashboard");
    } else {
      alert("Fehler beim Verlassen des Teams");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2 text-center">Team-Einstellungen</h1>

      {/* Schlanker „Team verlassen“ Bereich */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-800 dark:text-gray-200">Team verlassen</span>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-4 h-4" />
            Verlassen
          </button>
        </div>
      </div>

      {/* Platzhalter-Inhalt */}
      <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
        <p className="text-gray-700 dark:text-gray-200 text-center">
          Diese Seite ist aktuell nur ein Platzhalter. Später folgen Optionen wie Team-Name ändern, Rollen verwalten, etc.
        </p>
      </div>

      {/* Bestätigungs-Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Team wirklich verlassen?
            </h3>
            <p className="text-sm text-red-500 mb-4">
              Möchtest du dieses Team dauerhaft verlassen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={leaveTeam}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verlasse…" : "Ja, verlassen"}
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
    </div>
  );
}

// Hier wird das Layout nur einmalig über getLayout angehängt:
TeamSettingsPage.getLayout = (page: ReactElement) => (
  <UserSettingsLayout>{page}</UserSettingsLayout>
);
