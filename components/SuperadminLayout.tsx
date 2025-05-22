import Layout from "@/components/Layout";
import Link from "next/link";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Superadmin Navigation</h1>
          <nav className="space-x-4 text-sm">
            <Link href="/superadmin" className="text-blue-600 hover:underline">
              Übersicht
            </Link>
            <Link href="/superadmin/board" className="text-blue-600 hover:underline">
              ToDo-Board
            </Link>
            <Link href="/admin/audit" className="text-blue-600 hover:underline">
              Audit-Log
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </Layout>
  );
}
