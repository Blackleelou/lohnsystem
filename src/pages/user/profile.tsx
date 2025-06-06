// src/pages/user/profile.tsx

import { ReactElement, useState } from "react";
import { signOut } from "next-auth/react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";
import { Trash2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deleteAccount = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setShowDelete(false);
      alert("Account gelöscht");
      signOut({ callbackUrl: "/" });
    } else {
      alert("Fehler beim Löschen des Accounts");
    }
  };

  return (
    <UserSettingsLayout>
      <div className="max-w-md mx-auto py-6 px-2 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Profil Einstellungen</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
          <p className="text-gray-700 dark:text-gray-200">
            In dieser Ansicht kannst du zukünftig deine Profildaten bearbeiten. (Placeholder)
          </p>
        </div>

        {/* Account löschen */}
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-medium">Account löschen</span>
          </div>
          <p className="text-xs text-red-500 text-center">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <button
            onClick={() => setShowDelete(true)}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-4 py-2 transition"
          >
            {loading ? "Lösche..." : "Account löschen"}
          </button>
        </section>

        {/* Bestätigungs-Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Account wirklich löschen?
              </h3>
              <p className="text-sm text-red-500 mb-4">
                Willst du deinen Account dauerhaft löschen? Das kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={deleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Lösche..." : "Ja, löschen"}
                </button>
                <button
                  onClick={() => setShowDelete(false)}
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

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
