// src/components/user/UserSettingsLayout.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Settings as SettingsIcon,
  KeyRound,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Definieren der Sidebar-Links für die Benutzer-Einstellungen
  const links = [
    {
      href: "/user/settings",
      label: "Profil",
      icon: <SettingsIcon />,
    },
    {
      href: "/user/settings/security",
      label: "Sicherheit",
      icon: <KeyRound />,
    },
    {
      href: "/user/settings/notifications",
      label: "Benachrichtigungen",
      icon: <Bell />,
    },
    {
      href: "/user/settings/team",
      label: "Team-Einstellungen",
      icon: <Building2 />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 shadow-md flex flex-col min-h-screen sticky top-0 z-40 transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Collapse/Expand Button */}
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <div
          className={`px-6 py-4 items-center border-b dark:border-gray-800 ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <span className="text-lg font-bold text-blue-700 dark:text-blue-200">
            Meine Einstellungen
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
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

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
