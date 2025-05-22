import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu"; // Bürger-Menü

const links = [
  { href: "/superadmin", label: "Übersicht" },
  { href: "/admin/board", label: "Tagebuch & ToDo" },
  { href: "/admin/audit", label: "Audit-Log" },
  // Weitere Superadmin-Menüpunkte folgen hier
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-800 text-white px-6 py-3 shadow flex items-center justify-between">
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:underline ${
                router.pathname === link.href ? "font-semibold underline" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <UserMenu />
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
