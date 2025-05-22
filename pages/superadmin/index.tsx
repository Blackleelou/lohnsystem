// Datei: pages/superadmin/index.tsx

import Link from "next/link";

export default function SuperadminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Superadmin-Menü</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 shadow rounded border">
          <h2 className="text-lg font-semibold mb-2">Verwaltung & Auswertung</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <Link href="/admin/audit" className="text-blue-600 hover:underline">
                Audit-Log einsehen
              </Link>
            </li>
            <li>
              <Link href="/admin/board" className="text-blue-600 hover:underline">
                Tagebuch & ToDo-Board öffnen
              </Link>
            </li>
            <li className="text-gray-400">[Geplant] Firmenverwaltung (kommt später)</li>
          </ul>
        </div>

        <div className="bg-white p-4 shadow rounded border">
          <h2 className="text-lg font-semibold mb-2">System & Funktionen</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="text-gray-400">[Geplant] Registrierungsstatus verwalten</li>
            <li className="text-gray-400">[Geplant] Unterstützungslinks steuern</li>
            <li className="text-gray-400">[Geplant] Statistik-Modul anzeigen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Layout zuweisen
import SuperadminLayout from "@/components/SuperadminLayout";

SuperadminPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
