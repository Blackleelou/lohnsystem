// src/pages/user/profile.tsx

import { ReactElement, useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function ProfilePage() {
  // Lokaler State für Ladezustand und Anzeige des Bestätigungs-Popups
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Funktion, um den Account wirklich zu löschen
  const deleteAccount = async () => {
    setLoading(true); // Setze Ladezustand
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false); // Ladezustand zurücksetzen
    if (res.ok) {
      setShowDelete(false); // Schließe das Bestätigungs-Popup
      alert("Account gelöscht"); // Rückmeldung an den Nutzer
      signOut({ callbackUrl: "/" }); // Logout und Weiterleitung zur Startseite
    } else {
      alert("Fehler beim Löschen des Accounts"); // Fehleranzeige
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-2 space-y-4">
      {/* Überschrift in kleinerer Schrift, zentriert */}
      <h1 className="text-xl font-semibold text-center">Profil Einstellungen</h1>

      {/* Platzhalter-Box für Profilbearbeitung */}
      <div className="bg-white dark:bg-gray-900 rounded shadow border border-gray-100 dark:border-gray-800 p-2 text-xs">
        <p className="text-gray-700 dark:text-gray-200">
          Hier kannst du später deine Profildaten bearbeiten. (Placeholder)
        </p>
      </div>

      {/* Abschnitt: Account löschen, schlankes Design */}
      <section className="bg-white dark:bg-gray-900 rounded shadow border border-gray-100 dark:border-gray-800 p-2 flex flex-col items-center space-y-2">
        {/* Icon und Titel mit kleiner Schrift */}
        <div className="flex items-center gap-1">
          <Trash2 className="w-4 h-4 text-red-500" />
          <span className="text-red-600 font-medium text-sm">Account löschen</span>
        </div>
        {/* Hinweistext in noch kleinerer Schrift */}
        <p className="text-xs text-red-500 text-center">
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        {/* Lösch-Button in kompaktem Stil */}
        <button
          onClick={() => setShowDelete(true)} // Öffnet das Bestätigungs-Popup
          disabled={loading} // Deaktiviert Button während des Löschens
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded px-3 py-1 transition"
        >
          {loading ? "Lösche..." : "Account löschen"} {/* Text abhängig vom Ladezustand */}
        </button>
      </section>

      {/* Bestätigungs-Modal, wenn showDelete = true */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded p-4 shadow border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            {/* Modal-Überschrift in kompakter Form */}
            <h3 className="text-base font-semibold text-red-700 mb-1 flex items-center gap-1">
              <Trash2 className="w-4 h-4 text-red-500" />
              Account wirklich löschen?
            </h3>
            {/* Warnhinweis in kleiner Schrift */}
            <p className="text-xs text-red-500 mb-2">
              Willst du deinen Account dauerhaft löschen? Das kann nicht rückgängig gemacht werden.
            </p>
            {/* Buttons im Modal */}
            <div className="flex justify-end gap-2">
              {/* Button „Ja, löschen“ kompakt */}
              <button
                onClick={deleteAccount} // Führt die Löschfunktion aus
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded px-2 py-1 transition disabled:opacity-50"
                disabled={loading} // Deaktiviert Button während des Löschens
              >
                {loading ? "Lösche..." : "Ja, löschen"} {/* Text je nach Ladezustand */}
              </button>
              {/* Button „Abbrechen“ kompakt */}
              <button
                onClick={() => setShowDelete(false)} // Schließt das Popup
                className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium rounded px-2 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                disabled={loading} // Während des Löschens deaktiviert
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

// Layout-Funktion, die um die Seite herum das UserSettingsLayout rendert
ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
