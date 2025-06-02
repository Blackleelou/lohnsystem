import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "@/components/user/UserMenu";

const links = [
  { href: "/superadmin", label: "Übersicht" },
  { href: "/superadmin/companies", label: "Firmen" },
  { href: "/superadmin/board", label: "ToDo-Board" },
  { href: "/superadmin/audit", label: "Audit-Log" },
  { href: "/superadmin/debug-mode", label: "Debug-Modus" },
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
      <nav className="bg-gray-100 px-6 py-2 border-b flex gap-6 sticky top-[60px] z-40">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm md:text-base ${
              router.pathname === link.href
                ? "text-blue-600 font-semibold underline"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Inhaltsbereich */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
