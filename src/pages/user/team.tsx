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

  const deleteTeam = async () => {
    setLoading(true);
    // API-Aufruf später implementieren
    const res = await fetch("/api/team/delete", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setShowConfirm(false);
      alert("Team gelöscht");
      // Bei Bedarf weiterleiten, z. B. auf Dashboard
      // router.push("/dashboard");
    } else {
      alert("Fehler beim Löschen des Teams");
    }
  };

  return (
    <UserSettingsLayout>
      <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Team-Einstellungen</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Hier kannst du deine Team-Einstellungen verwalten. (Dummy-Seite)
        </p>

        {/* Schlanker „Team löschen“ Bereich */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-gray-200">Team löschen</span>
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
        <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <p className="text-gray-700 dark:text-gray-200">
            Diese Seite ist derzeit nur ein Platzhalter. Später können hier Optionen wie Team-Name ändern,
            Rollen verwalten oder andere Team-spezifische Einstellungen folgen.
          </p>
        </div>

        {/* Bestätigungs-Dialog */}
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
                  onClick={deleteTeam}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Lösche…" : "Ja, löschen"}
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
    </UserSettingsLayout>
  );
}

TeamSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
