import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "@/components/user/UserMenu";
import { Menu } from "lucide-react";
import { useState } from "react";

// Gleiches Link-Array wie vorher
const links = [
  { href: "/superadmin", label: "Übersicht" },
  { href: "/superadmin/companies", label: "Firmen" },
  { href: "/superadmin/board", label: "ToDo-Board" },
  { href: "/superadmin/audit", label: "Audit-Log" },
  { href: "/superadmin/debug-mode", label: "Debug-Modus" },
  { href: "/superadmin/health", label: "Health-Checks" },
  { href: "/superadmin/errors", label: "Fehler-Log" },
  { href: "/superadmin/users", label: "User-Monitoring" },
  { href: "/superadmin/housekeeping", label: "Housekeeping" },
  { href: "/superadmin/maintenance", label: "Maintenance" },
  { href: "/superadmin/deploy", label: "Deployments" },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top-Leiste */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="text-lg font-semibold text-blue-700">Superadmin-Bereich</span>
        <UserMenu />
      </header>

      {/* Dropdown-Menü */}
      <nav className="bg-gray-100 px-6 py-2 border-b sticky top-[60px] z-40">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu className="w-5 h-5" />
          Superadmin-Menü
        </button>
        {menuOpen && (
          <div className="mt-3 bg-white border rounded-lg shadow-lg flex flex-col absolute left-0 right-0 mx-4 z-50 p-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded hover:bg-blue-50 ${
                  router.pathname === link.href ? "font-bold text-blue-700 underline" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Inhaltsbereich */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
