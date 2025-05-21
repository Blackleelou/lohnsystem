import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/admin/board", label: "Tagebuch & ToDo" },
  { href: "/admin/audit", label: "Audit-Log" },
  // Weitere Superadmin-Links kannst du hier ergänzen
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-3 flex gap-6 sticky top-0 z-40">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`${router.pathname === link.href
              ? "text-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-500"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
