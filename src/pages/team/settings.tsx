// src/pages/team/settings.tsx

import TeamLayout from "@/components/team/TeamLayout";

export default function TeamSettingsPage() {
  return (
    <TeamLayout>
      <div className="max-w-2xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded mb-4">
          Willkommen in deinem Team! Über das Menü links kannst du weitere Bereiche aufrufen.
        </div>
      </div>
    </TeamLayout>
  );
}
