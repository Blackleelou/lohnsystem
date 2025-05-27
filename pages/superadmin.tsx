// Datei: pages/superadmin.tsx

import Link from "next/link";
import SuperadminLayout from "@/components/SuperadminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext } from "next";
// Optional: lucide-react für echte Icons (npm install lucide-react)
import { ClipboardList, SearchCheck, Bug, Building, Lock, Link2, BarChart3 } from "lucide-react";

export default function SuperadminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Superadmin-Menü</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verwaltung & Auswertung */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-7 flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
            <ClipboardList className="w-5 h-5 mr-2" /> Verwaltung & Auswertung
          </h2>
          <Link href="/admin/board" className="text-blue-600 hover:underline flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Übersicht & ToDo-Board
          </Link>
          <Link href="/admin/audit" className="text-blue-600 hover:underline flex items-center gap-2">
            <SearchCheck className="w-4 h-4" />
            Audit-Log einsehen
          </Link>
          <Link href="/debug-mode" className="text-blue-600 hover:underline flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug-Modus anzeigen
          </Link>
          <div className="text-gray-400 flex items-center gap-2">
            <Building className="w-4 h-4" />
            [Geplant] Firmenverwaltung (kommt später)
          </div>
        </section>

        {/* Systemfunktionen */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-7 flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
            <Lock className="w-5 h-5 mr-2" /> System & Funktionen
          </h2>
          <div className="text-gray-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            [Geplant] Registrierungsstatus verwalten
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            [Geplant] Unterstützungslinks steuern
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            [Geplant] Statistik-Modul anzeigen
          </div>
        </section>
      </div>
    </div>
  );
}

// Layout einbinden
SuperadminPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);

// Zugriffsschutz
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
