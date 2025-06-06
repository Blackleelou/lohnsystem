// src/pages/user/profile.tsx

import { ReactElement, useState } from "react";
import { signOut } from "next-auth/react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";
import { Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteAccount = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      alert("Account gelöscht");
      signOut({ callbackUrl: "/" });
    } else {
      alert("Fehler beim Löschen des Accounts");
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-2 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Profil Einstellungen</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
        <p className="text-gray-700 dark:text-gray-200">
          In dieser Ansicht kannst du zukünftig deine Profildaten bearbeiten. (Placeholder)
        </p>
      </div>

      {/* Schlanker „Account löschen“ Bereich */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-800 dark:text-gray-200">Account löschen</span>
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

      {/* Bestätigungsdialog (schlank) */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs mx-auto">
            <p className="text-gray-800 dark:text-gray-200 text-center mb-4">
              Willst du deinen Account wirklich löschen?
            </p>
            <div className="flex justify-between gap-2">
              <button
                onClick={deleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded px-3 py-1 transition"
              >
                {loading ? "Lösche…" : "Ja, löschen"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
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

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
