// src/pages/user/profile.tsx

import { ReactElement } from "react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto py-6 px-2 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Profil Einstellungen</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 space-y-2 text-sm">
        <p>Hier kannst du deine Profildaten bearbeiten. (Dummy‐Inhalt)</p>
        {/* Beispiel-Formularelement, schlank gehalten */}
        <label className="block">
          <span className="text-gray-700 dark:text-gray-200">Name</span>
          <input
            type="text"
            placeholder="Max Mustermann"
            className="mt-1 block w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 dark:text-gray-200">E-Mail</span>
          <input
            type="email"
            placeholder="max@beispiel.de"
            className="mt-1 block w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-sm"
          />
        </label>
        <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-4 py-2 transition">
          Speichern
        </button>
      </div>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
