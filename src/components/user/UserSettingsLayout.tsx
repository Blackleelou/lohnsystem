// src/components/user/UserSettingsLayout.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserMenu from '@/components/user/UserMenu';
import {
  User as UserIcon,
  Key,
  Bell,
  Settings as TeamIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
  
export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user-sidebar-collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('user-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const baseLinks = [
    { href: '/user/profile', label: 'Profil‐Einstellungen', icon: <UserIcon /> },
    { href: '/user/security', label: 'Sicherheit', icon: <Key /> },
    { href: '/user/notifications', label: 'Benachrichtigungen', icon: <Bell /> },
  ];

  const teamLink = companyId
    ? [{ href: '/user/team', label: 'Team‐Einstellungen', icon: <TeamIcon /> }]
    : [];

  const links = [...baseLinks, ...teamLink];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-1">
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

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="px-6 py-4 items-center border-b dark:border-gray-800 flex"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="text-lg font-bold text-blue-700 dark:text-blue-200">
                  Einstellungen
                </span>
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
                    ${collapsed ? 'justify-center' : 'justify-start'}
                    ${
                      isActive
                        ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800'
                    }`}
                  title={link.label}
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
          <motion.main
            className="flex-1 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </div>
      </div>

      {/* Footer mit Impressum */}
      <footer className="text-xs text-center text-gray-400 dark:text-gray-500 py-6">
        <a href="/legal" className="underline hover:text-blue-600 dark:hover:text-blue-400">
          Impressum & Datenschutz
        </a>
      </footer>
    </div>
  );
}
