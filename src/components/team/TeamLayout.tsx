import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/user/UserMenu";
import {
  User as UserIcon,
  Key,
  Bell,
  Settings as TeamIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  const [collapsed, setCollapsed] = useState(false);

  // Basis‐Links
  const baseLinks = [
    { href: "/user/profile", label: "Profil‐Einstellungen", icon: <UserIcon /> },
    { href: "/user/security", label: "Sicherheit", icon: <Key /> },
    { href: "/user/notifications", label: "Benachrichtigungen", icon: <Bell /> },
  ];

  // Team‐Link nur wenn Firma vorhanden
  const teamLink = companyId
    ? [{ href: "/user/team", label: "Team‐Einstellungen", icon: <TeamIcon /> }]
    : [];

  const links = [...baseLinks, ...teamLink];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 shadow-md flex flex-col min-h-screen sticky top-0 z-40
        transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Collapse/Expand Button */}
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Titelzeile */}
        <div
          className={`px-6 py-4 items-center border-b dark:border-gray-800 ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <span className="text-lg font-bold text-blue-700 dark:text-blue-200">
            Einstellungen
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  router.pathname === link.href
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800"
                }`}
              title={link.label}
            >
              <span className="w-5 h-5">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content-Bereich */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
