import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "@/components/user/UserMenu";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/superadmin", label: "Übersicht" },
  { href: "/superadmin/companies", label: "Firmen" },
  { href: "/superadmin/board", label: "ToDo-Board" },
  { href: "/superadmin/audit", label: "Audit-Log" },
  { href: "/superadmin/debug-mode", label: "Debug-Modus" },
  // ... weitere geplante Punkte, z.B. Health-Checks, Fehler-Log ...
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top-Leiste */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <button
          className="lg:hidden mr-3"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menü öffnen"
        >
          <Menu className="w-7 h-7 text-blue-700" />
        </button>
        <span className="text-lg font-semibold text-blue-700 flex-1">Superadmin-Bereich</span>
        <UserMenu />
      </header>

      {/* Sidebar (mobil als Overlay, Desktop fest) */}
      <div className="flex flex-1">
        {/* Overlay für Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-lg transition-transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
          style={{ transition: "transform 0.3s" }}
        >
          {/* Schließen-Button mobil */}
          <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b">
            <span className="font-bold text-blue-700">Superadmin</span>
            <button onClick={() => setSidebarOpen(false)} aria-label="Schließen">
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Links */}
          <nav className="flex flex-col p-4 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg ${
                  router.pathname === link.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Hauptinhalt */}
        <main className="flex-1 p-6 lg:ml-0 ml-0">{children}</main>
      </div>
    </div>
  );
}
