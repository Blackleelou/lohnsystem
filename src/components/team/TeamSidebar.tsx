// src/components/team/TeamSidebar.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import {
  Users, Settings, KeyRound, Trash, QrCode, ChevronLeft, ChevronRight,
  Percent, Clock, Euro, FileText, MessageCircle
} from "lucide-react";
import { useState } from "react";

// Menüstruktur als Array von Gruppen für einfache Erweiterung
const menuGroups = [
  {
    label: "Team",
    items: [
      { href: "/team/settings", icon: <Settings className="w-5 h-5" />, label: "Allgemein" },
      { href: "/team/members", icon: <Users className="w-5 h-5" />, label: "Mitglieder" },
      { href: "/team/invites", icon: <QrCode className="w-5 h-5" />, label: "Einladungen" },
      { href: "/team/security", icon: <KeyRound className="w-5 h-5" />, label: "Zugangs-Code" },
      { href: "/team/delete", icon: <Trash className="w-5 h-5" />, label: "Team löschen", danger: true },
    ]
  },
  {
    label: "Lohn & Zeit",
    items: [
      { href: "/team/lohngroups", icon: <Percent className="w-5 h-5" />, label: "Lohngruppen" },
      { href: "/team/allowances", icon: <Percent className="w-5 h-5" />, label: "Zuschläge" },
      { href: "/team/shifts", icon: <Clock className="w-5 h-5" />, label: "Schichten" },
      { href: "/team/payroll", icon: <Euro className="w-5 h-5" />, label: "Abrechnung" },
    ]
  },
  {
    label: "Extras",
    items: [
      { href: "/team/docs", icon: <FileText className="w-5 h-5" />, label: "Dokumente" },
      { href: "/team/chat", icon: <MessageCircle className="w-5 h-5" />, label: "Team-Chat" },
    ]
  }
];

export default function TeamSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <aside className={`transition-all duration-300 bg-blue-50 dark:bg-blue-900/40 rounded-xl p-3 ${open ? "min-w-[200px] pr-4" : "w-14 p-2"}`}>
      {/* Toggle-Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="absolute left-0 top-4 z-10 bg-blue-100 dark:bg-blue-950 p-1 rounded-full shadow hover:bg-blue-200 dark:hover:bg-blue-800"
        aria-label={open ? "Menü zuklappen" : "Menü aufklappen"}
        style={{ transform: open ? "translateX(-50%)" : "translateX(-30%)" }}
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <nav>
        {menuGroups.map(group => (
          <div key={group.label} className="mb-6">
            {open && (
              <span className="text-xs font-bold uppercase text-blue-500 block mb-2">
                {group.label}
              </span>
            )}
            <ul className="space-y-1">
              {group.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded font-semibold transition
                      ${router.pathname === item.href ? "bg-blue-100 dark:bg-gray-900 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}
                      ${item.danger ? "text-red-600 dark:text-red-400" : ""}
                      ${open ? "justify-start" : "justify-center"}
                    `}
                  >
                    {item.icon}
                    {open && item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
