import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserMenu from "@/components/user/UserMenu";
import {
  ShieldCheck,
  List,
  Building2,
  ClipboardCheck,
  Bug,
  Activity,
  Users,
  Settings2,
  Server,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/superadmin", label: "Übersicht", icon: <ShieldCheck /> },
  { href: "/superadmin/health", label: "System-Status", icon: <Activity /> },
  { href: "/superadmin/companies", label: "Firmen", icon: <Building2 /> },
  { href: "/superadmin/board", label: "ToDo-Board", icon: <List /> },
  { href: "/superadmin/audit", label: "Audit-Log", icon: <ClipboardCheck /> },
  { href: "/superadmin/errors", label: "Fehler-Logs", icon: <Bug /> },
  { href: "/superadmin/users", label: "User-Monitoring", icon: <Users /> },
  { href: "/superadmin/maintenance", label: "Wartung/Tools", icon: <Settings2 /> },
  { href: "/superadmin/server", label: "Server/DevOps", icon: <Server /> },
  { href: "/superadmin/statistics", label: "Statistiken", icon: <BarChart2 /> },
  { href: "/superadmin/debug-mode", label: "Debug-Modus", icon: <Bug /> },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("superadmin-sidebar-collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("superadmin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <motion.aside
        className="bg-white shadow-md flex flex-col min-h-screen sticky top-0 z-40"
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="px-6 py-4 items-center border-b flex"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="text-lg font-bold text-blue-700">Superadmin</span>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {links.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition overflow-hidden
                  ${collapsed ? "justify-center" : "justify-start"}
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                title={link.label}
              >
                <motion.span
                  className="w-5 h-5 flex-shrink-0"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {link.icon}
                </motion.span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
