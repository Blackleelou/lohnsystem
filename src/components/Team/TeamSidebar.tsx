import Link from "next/link";
import { Users, Settings, KeyRound, Trash, QrCode } from "lucide-react";
import { useRouter } from "next/router";

const menu = [
  { href: "/team/settings", icon: <Settings className="w-5 h-5" />, label: "Allgemein" },
  { href: "/team/members", icon: <Users className="w-5 h-5" />, label: "Mitglieder" },
  { href: "/team/invites", icon: <QrCode className="w-5 h-5" />, label: "Einladungen" },
  { href: "/team/security", icon: <KeyRound className="w-5 h-5" />, label: "Zugangs-Code" },
  { href: "/team/delete", icon: <Trash className="w-5 h-5" />, label: "Team löschen", danger: true },
];

export default function TeamSidebar() {
  const router = useRouter();

  return (
    <aside className="min-w-[200px] pr-4 border-r dark:border-gray-800 py-8">
      <nav className="flex flex-col gap-2">
        {menu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded font-semibold hover:bg-blue-50 dark:hover:bg-gray-800
              ${router.pathname === item.href ? "bg-blue-100 dark:bg-gray-900 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}
              ${item.danger ? "text-red-600 dark:text-red-400" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
