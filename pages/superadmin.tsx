// Datei: pages/superadmin.tsx

import Link from "next/link";
import SuperadminLayout from "@/components/SuperadminLayout";

export default function SuperadminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Superadmin-Menü</h1>

      <div className="space-y-6">
        <section className="bg-white p-6 shadow rounded border">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Verwaltung & Auswertung
          </h2>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
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
            <li className="text-gray-400">
              [Geplant] Firmenverwaltung (kommt später)
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 shadow rounded border">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            System & Funktionen
          </h2>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li className="text-gray-400">[Geplant] Registrierungsstatus verwalten</li>
            <li className="text-gray-400">[Geplant] Unterstützungslinks steuern</li>
            <li className="text-gray-400">[Geplant] Statistik-Modul anzeigen</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// SuperadminLayout zuweisen
SuperadminPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
