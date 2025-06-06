// src/pages/user/settings/team.tsx

import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";
import { Trash2 } from "lucide-react";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function TeamSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const leaveTeam = async () => {
    setLoading(true);
    const res = await fetch("/api/team/leave", { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setShowConfirm(false);
      alert("Du bist erfolgreich aus dem Team ausgetreten.");
      // Hier kannst du optional weiterleiten, z.B. auf /dashboard
      // router.push("/dashboard");
    } else {
      alert("Fehler beim Verlassen des Teams");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2 text-center">Team-Einstellungen</h1>
      <p className="text-center text-gray-600 dark:text-gray-300">
        Hier kannst du deine Team-Einstellungen verwalten. (Dummy-Seite)
      </p>

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
            Löschen
          </button>
        </div>
      </div>

      {/* Platzhalter-Inhalt */}
      <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 text-gray-700 dark:text-gray-200">
        <p>
          Diese Seite ist derzeit nur ein Platzhalter. Später kommen hier Optionen
          wie Team-Name ändern, Rollen verwalten oder andere team-spezifische Einstellungen.
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
              Möchtest du dieses Team wirklich verlassen? Dieser Schritt kann nicht rückgängig gemacht werden.
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

// HIER: Layout nur per getLayout, nicht nochmals im JSX-Return
TeamSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
