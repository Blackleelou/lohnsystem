import SuperadminLayout from "@/components/SuperadminLayout";
import Link from "next/link";

export default function SuperadminPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Superadmin-Menü</h1>

        <div className="space-y-6">
          <section className="bg-white p-6 shadow rounded border">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Verwaltung & Auswertung</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <Link href="/admin/audit" className="text-blue-600 hover:underline">
                  Audit-Log einsehen
                </Link>
              </li>
              <li>
                <Link href="/superadmin/board" className="text-blue-600 hover:underline">
                  Tagebuch & ToDo-Board öffnen
                </Link>
              </li>
              <li className="text-gray-400">
                [Geplant] Firmenverwaltung <span className="text-xs">(kommt später)</span>
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 shadow rounded border">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">System & Funktionen</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li className="text-gray-400">[Geplant] Registrierungsstatus verwalten</li>
              <li className="text-gray-400">[Geplant] Unterstützungslinks steuern</li>
              <li className="text-gray-400">[Geplant] Statistik-Modul anzeigen</li>
            </ul>
          </section>
        </div>
      </div>
    </SuperadminLayout>
  );
}
