// src/components/team/TeamLayout.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import UserMenu from "@/components/user/UserMenu";
import {
  Users,
  QrCode,
  KeyRound,
  BarChart2,
  List,
  Folder,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("team-sidebar-collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("team-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const links = [
    { href: "/team/members", label: "Mitglieder", icon: <Users /> },
    { href: "/team/invites", label: "Einladungen", icon: <QrCode /> },
    { href: "/team/security", label: "Zugangs-Code", icon: <KeyRound /> },
    { href: "/team/payrules", label: "Zuschläge", icon: <BarChart2 /> },
    { href: "/team/shifts", label: "Schichten", icon: <List /> },
    { href: "/team/files", label: "Dokumente", icon: <Folder /> },
    { href: "/team/delete", label: "Team löschen", icon: <Trash />, danger: true },
  ];

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
            Teambereich
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
