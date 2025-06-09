// src/components/team/TeamLayout.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import UserMenu from '@/components/user/UserMenu';
import { useSession } from 'next-auth/react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const links = [
    { href: '/team/members', label: 'Mitglieder', icon: <Users /> },
    { href: '/team/invites', label: 'Einladungen', icon: <QrCode /> },
    { href: '/team/security', label: 'Zugangs-Code', icon: <KeyRound /> },
    { href: '/team/payrules', label: 'Zuschläge', icon: <BarChart2 /> },
    { href: '/team/shifts', label: 'Schichten', icon: <List /> },
    { href: '/team/files', label: 'Dokumente', icon: <Folder /> },
    { href: '/team/delete', label: 'Team löschen', icon: <Trash />, danger: true },
  ];

  const router = useRouter(); // oberhalb von visibleLinks

  // Links je nach Rolle filtern
  const visibleLinks = links.filter((link) => {
    if (role === 'admin') return true;
    if (role === 'editor') return ['/team/payrules', '/team/shifts'].includes(link.href);
    return false; // viewer oder unbekannt: nichts anzeigen
  });
  
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('team-sidebar-collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('team-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <motion.aside
        className="bg-white dark:bg-gray-900 shadow-md flex flex-col min-h-screen sticky top-0 z-40"
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <button
          className="p-2 self-end mt-2 mr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {!collapsed && (
          <motion.div
            className="px-6 py-4 items-center border-b dark:border-gray-800 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-lg font-bold text-blue-700 dark:text-blue-200">Teambereich</span>
          </motion.div>
        )}

        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {visibleLinks.map((link) => {
            const isActive = router.pathname === link.href;
              return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition overflow-hidden
                  ${collapsed ? 'justify-center' : 'justify-start'}
                  ${
                    isActive
                      ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800'
                  }
                  ${link.danger ? 'text-red-600 dark:text-red-400' : ''}`}
                title={link.label}
                prefetch={false}
                scroll={false}
                replace={false}
              >
                <motion.span
                  className="w-5 h-5 flex-shrink-0"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
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
        <header className="bg-white dark:bg-gray-900 shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
          <UserMenu />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
