// src/pages/user/settings/team.tsx

import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function TeamSettingsPage() {
  return (
    <UserSettingsLayout>
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Team-Einstellungen</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Hier kannst du deine Team-Einstellungen verwalten. (Dummy-Seite)
        </p>
        {/* Platzhalter-Inhalt */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <p className="text-gray-700 dark:text-gray-200">
            Diese Seite ist derzeit nur ein Platzhalter. Später können hier Optionen wie Team-Name ändern,
            Rollen verwalten oder andere Team-spezifische Einstellungen folgen.
          </p>
        </div>
      </div>
    </UserSettingsLayout>
  );
}
