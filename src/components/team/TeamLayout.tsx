// src/components/team/TeamLayout.tsx

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
  Building2,
  List,
  BarChart2,
} from "lucide-react";

const links = [
  { href: "/team", label: "Übersicht", icon: <Building2 /> },
  { href: "/team/settings", label: "Allgemein", icon: <Settings /> },
  { href: "/team/members", label: "Mitglieder", icon: <Users /> },
  { href: "/team/invites", label: "Einladungen", icon: <QrCode /> },
  { href: "/team/security", label: "Zugangs-Code", icon: <KeyRound /> },
  { href: "/team/payrules", label: "Zuschläge", icon: <BarChart2 /> },
  { href: "/team/shifts", label: "Schichten", icon: <List /> },
  { href: "/team/delete", label: "Team löschen", icon: <Trash />, danger: true },
];

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md flex flex-col min-h-screen sticky top-0 z-40 transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Collapse/Expand Button */}
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <div className={`px-6 py-4 items-center border-b ${collapsed ? "hidden" : "flex"}`}>
          <span className="text-lg font-bold text-blue-700">Team-Menü</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                router.pathname === link.href
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-100"
              } ${link.danger ? "text-red-600" : ""}`}
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
        <header className="bg-white shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
