import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "@/components/user/UserMenu";
import {
  Home, Building, ClipboardList, FileSearch, Bug,
  Users, Server, Wrench, UploadCloud, ShieldCheck,
} from "lucide-react";

const links = [
  // DEINE ALTEN SEITEN zuerst
  { href: "/superadmin", label: "Übersicht", icon: <Home className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/companies", label: "Firmen", icon: <Building className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/board", label: "ToDo-Board", icon: <ClipboardList className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/audit", label: "Audit-Log", icon: <FileSearch className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/debug-mode", label: "Debug-Modus", icon: <Bug className="w-4 h-4 mr-1" /> },

  // NEUE BEREICHE aus deinem Konzept (nach ALTEN Seiten)
  { href: "/superadmin/health", label: "Health-Checks", icon: <ShieldCheck className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/errors", label: "Fehler-Log", icon: <Bug className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/users", label: "User-Monitoring", icon: <Users className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/housekeeping", label: "Housekeeping", icon: <Server className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/maintenance", label: "Maintenance", icon: <Wrench className="w-4 h-4 mr-1" /> },
  { href: "/superadmin/deploy", label: "Deployments", icon: <UploadCloud className="w-4 h-4 mr-1" /> },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top-Leiste mit UserMenu */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="text-lg font-semibold text-blue-700">Superadmin-Bereich</span>
        <UserMenu />
      </header>

      {/* Superadmin-Menüleiste */}
      <nav className="bg-gray-100 px-6 py-2 border-b flex gap-6 sticky top-[60px] z-40 overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center text-sm md:text-base ${
              router.pathname === link.href
                ? "text-blue-600 font-semibold underline"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Inhaltsbereich */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
