// src/pages/user/profile.tsx

import { ReactElement } from "react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto py-6 px-2 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Profil Einstellungen</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
        <p className="text-gray-700 dark:text-gray-200">
          In dieser Ansicht kannst du zukünftig deine Profildaten bearbeiten. (Placeholder)
        </p>
      </div>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
