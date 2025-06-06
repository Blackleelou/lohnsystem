import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import UserMenu from "@/components/user/UserMenu";
import {
  Users,
  Settings,
  QrCode,
  KeyRound,
  Trash,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  List,
  Folder,
} from "lucide-react";

const links = [
  { href: "/team/settings", label: "Allgemein", icon: <Settings /> },
  { href: "/team/members", label: "Mitglieder", icon: <Users /> },
  { href: "/team/invites", label: "Einladungen", icon: <QrCode /> },
  { href: "/team/security", label: "Zugangs-Code", icon: <KeyRound /> },
  { href: "/team/payrules", label: "Zuschläge", icon: <BarChart2 /> },
  { href: "/team/shifts", label: "Schichten", icon: <List /> },
  { href: "/team/files", label: "Dokumente", icon: <Folder /> },
  { href: "/team/delete", label: "Team löschen", icon: <Trash />, danger: true },
];

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out 
        bg-white dark:bg-gray-900 shadow-md flex flex-col
        ${collapsed ? "w-16" : "w-64"}`}
      >
        <div
          className={`px-6 py-4 items-center border-b dark:border-gray-800 ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <span className="text-lg font-bold text-blue-700 dark:text-blue-200">Team-Menü</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex w-full items-center ${
                collapsed ? "justify-center" : "justify-start"
              } gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  router.pathname === link.href
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800"
                }
                ${link.danger ? "text-red-600 dark:text-red-400" : ""}
              `}
              title={link.label}
            >
              <span className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                {link.icon}
              </span>
              {!collapsed && <span className="truncate transition-opacity duration-200">{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        className={`
          fixed top-4 left-16 z-50 p-2 rounded-full shadow bg-white dark:bg-gray-800
          transition-all duration-300 ease-in-out
          ${!collapsed ? "translate-x-48" : ""}
        `}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
      >
        <span
          className={`transition-transform duration-300 ease-in-out ${
            collapsed ? "rotate-180" : "rotate-0"
          }`}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </span>
      </button>

      {/* Main Area */}
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? "ml-16" : "ml-64"}`}>
        <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
