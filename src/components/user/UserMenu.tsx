import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import Link from "next/link";
import { LogOut, Settings, User, Shield, Palette, Building2 } from "lucide-react";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isSuperadmin = session?.user?.email === "jantzen.chris@gmail.com";
  const companyId = session?.user?.companyId;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="bg-white dark:bg-gray-800 border-none text-2xl cursor-pointer p-2 rounded-full shadow transition hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Benutzermenü öffnen"
      >
        <span className="block w-6 h-6">
          <svg width="100%" height="100%" viewBox="0 0 24 24">
            <rect y="4" width="24" height="2" rx="1" className="fill-gray-800 dark:fill-gray-100" />
            <rect y="11" width="24" height="2" rx="1" className="fill-gray-800 dark:fill-gray-100" />
            <rect y="18" width="24" height="2" rx="1" className="fill-gray-800 dark:fill-gray-100" />
          </svg>
        </span>
      </button>

      {/* ALLES INS DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 top-12 bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 rounded-2xl min-w-[220px] z-50 p-4 flex flex-col gap-2 animate-fade-in">
          {/* ThemeSwitch oben */}
          <div className="flex justify-center mb-2">
            <ThemeSwitch />
          </div>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5" />
            Dashboard
          </Link>

          {/* Persönliche Einstellungen: immer sichtbar */}
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-5 h-5" />
            Mein Konto
          </Link>

          {/* Team-Funktionen für Solo-User */}
          {!companyId && (
            <>
              <Link
                href="/team/create"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-violet-700 dark:text-violet-400 font-semibold hover:bg-violet-50 dark:hover:bg-gray-800 transition"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="w-5 h-5" />
                Team erstellen
              </Link>
              <Link
                href="/invite/join"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-green-700 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-gray-800 transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                Mit Einladung beitreten
              </Link>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
            </>
          )}

          {/* Firmeneinstellungen für Team-User */}
          {companyId && (
            <Link
              href="/team/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="w-5 h-5" />
              Firmeneinstellungen
            </Link>
          )}

          {/* Theme-Design */}
          <Link
            href="/admin/theme"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            onClick={() => setIsOpen(false)}
          >
            <Palette className="w-5 h-5" />
            Design & Theme
          </Link>

          {/* Superadmin-Menü */}
          {isSuperadmin && (
            <Link
              href="/superadmin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-5 h-5" />
              Superadmin-Menü
            </Link>
          )}

          {/* Admin-Panel (RA) nur für Superadmin */}
          {isSuperadmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-5 h-5" />
              Admin-Panel (RA)
            </Link>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          {/* Language Switcher */}
          <div className="flex justify-center pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}
