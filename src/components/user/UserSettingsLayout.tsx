// src/components/user/UserSettingsLayout.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-sidebar-collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("user-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const baseLinks = [
    { href: "/user/profile", label: "Profil‐Einstellungen", icon: <UserIcon /> },
    { href: "/user/security", label: "Sicherheit", icon: <Key /> },
    { href: "/user/notifications", label: "Benachrichtigungen", icon: <Bell /> },
  ];

  const teamLink = companyId
    ? [{ href: "/user/team", label: "Team‐Einstellungen", icon: <TeamIcon /> }]
    : [];

  const links = [...baseLinks, ...teamLink];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 shadow-md flex flex-col min-h-screen sticky top-0 z-40 transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Collapse Toggle */}
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Sidebar Header */}
        <div className={`px-6 py-4 items-center border-b dark:border-gray-800 ${collapsed ? "hidden" : "flex"}`}>
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
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${collapsed ? "justify-center" : "justify-start"}
                ${
                  router.pathname === link.href
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800"
                }
                ${link.danger ? "text-red-600 dark:text-red-400" : ""}`}
              title={link.label}
              prefetch={false}
              scroll={false}
              replace={false}
            >
              <span className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                {link.icon}
              </span>
              {!collapsed && <span className="truncate transition-opacity duration-200">{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
