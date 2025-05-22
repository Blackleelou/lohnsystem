import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

const links = [
  { href: "/superadmin", label: "Übersicht" },
  { href: "/admin/board", label: "ToDo-Board" },
  { href: "/admin/audit", label: "Audit-Log" },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Feste Top-Leiste */}
      <header className="bg-blue-800 text-white shadow flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <div className="text-lg font-bold">Superadmin</div>
        <UserMenu />
      </header>

      {/* Navigation als Tabs */}
      <nav className="bg-white shadow-sm px-4 py-2 border-b flex gap-6 justify-start sticky top-[52px] z-40">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm md:text-base ${
              router.pathname === link.href
                ? "text-blue-600 font-semibold underline"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Hauptinhalt */}
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
