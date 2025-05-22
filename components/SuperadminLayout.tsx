import Link from "next/link";
import { useRouter } from "next/router";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navItems = [
    { href: "/superadmin", label: "Übersicht" },
    { href: "/admin/board", label: "ToDo-Board" },
    { href: "/admin/audit", label: "Audit-Log" },
    // Erweiterbar...
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-blue-800 text-white px-6 py-3 shadow flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:underline ${
              router.pathname === item.href ? "font-semibold underline" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
