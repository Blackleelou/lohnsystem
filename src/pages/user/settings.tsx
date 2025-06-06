// src/pages/user/settings.tsx

import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import {
  LogOut,
  Trash2,
  KeyRound,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

import UserSettingsLayout from "@/components/user/UserSettingsLayout";

// Authentifizierung erzwingen
export const getServerSideProps: GetServerSideProps = requireAuth;

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Passwort‐Änderung
  const [oldPw, setOldPw] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");

  // Dummy‐State für Theme
  const [theme, setTheme] = useState("light");

  const deleteAccount = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setShowDelete(false);
      alert("Account gelöscht");
      signOut({ callbackUrl: "/" });
    } else {
      alert("Fehler beim Löschen des Accounts");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    if (oldPw.length < 6) {
      setPwMessage("Bitte dein aktuelles Passwort eingeben!");
      return;
    }
    if (pw1.length < 6) {
      setPwMessage("Mindestens 6 Zeichen!");
      return;
    }
    if (pw1 !== pw2) {
      setPwMessage("Die Passwörter stimmen nicht überein!");
      return;
    }
    setPwLoading(true);
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: pw1 }),
    });
    setPwLoading(false);
    if (res.ok) {
      setPwMessage("Passwort geändert!");
      setOldPw("");
      setPw1("");
      setPw2("");
    } else {
      const data = await res.json();
      setPwMessage(data.message || "Fehler beim Ändern.");
    }
  };

  return (
    <UserSettingsLayout>
      <div className="max-w-xl mx-auto py-10 px-2 flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Einstellungen</h1>

        {/* Passwort ändern */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <KeyRound className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">Passwort ändern</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleChangePassword}>
            <input
              className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              type="password"
              placeholder="Aktuelles Passwort"
              value={oldPw}
              minLength={6}
              autoComplete="current-password"
              onChange={(e) => setOldPw(e.target.value)}
            />
            <input
              className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              type="password"
              placeholder="Neues Passwort"
              value={pw1}
              minLength={6}
              autoComplete="new-password"
              onChange={(e) => setPw1(e.target.value)}
            />
            <input
              className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              type="password"
              placeholder="Wiederholen"
              value={pw2}
              minLength={6}
              autoComplete="new-password"
              onChange={(e) => setPw2(e.target.value)}
            />
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 transition"
            >
              {pwLoading ? "Speichern..." : "Speichern"}
            </button>
            {pwMessage && (
              <div className="text-sm mt-1 text-center text-blue-600">{pwMessage}</div>
            )}
          </form>
        </section>

        {/* Account löschen */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
              Account löschen
            </h2>
          </div>
          <p className="text-sm text-red-600 mb-4">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <button
            onClick={() => setShowDelete(true)}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition"
          >
            {loading ? "Lösche..." : "Account löschen"}
          </button>
        </section>

        {/* Lösch‐Bestätigungsdialog */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[340px]">
              <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" /> Account wirklich löschen?
              </h3>
              <p className="mb-4 text-red-500 text-sm">
                Willst du deinen Account wirklich dauerhaft löschen? Das kann NICHT
                rückgängig gemacht werden.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={deleteAccount}
                  className="flex-1 bg-red-600 text-white font-semibold rounded px-4 py-2 hover:bg-red-700 transition"
                  disabled={loading}
                >
                  {loading ? "Lösche..." : "Ja, löschen"}
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  disabled={loading}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Benachrichtigungseinstellungen */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">Benachrichtigungen</h2>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-500" disabled />
            E-Mail-Benachrichtigungen erhalten
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-500" disabled />
            Push-Benachrichtigungen (demnächst)
          </label>
        </section>

        {/* Theme-Auswahl */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-3">
            <Sun className="w-5 h-5 text-yellow-300" />
            <Moon className="w-5 h-5 text-gray-400 -ml-1" />
            <h2 className="text-lg font-semibold">Theme</h2>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded px-2 py-1 border bg-gray-50 dark:bg-gray-800"
          >
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
            <option value="system">System</option>
          </select>
        </section>

        {/* Aktive Sessions (Dummy) */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <LogOut className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Aktive Sessions</h2>
          </div>
          <div className="text-sm text-gray-500">
            <ul className="list-disc ml-6">
              <li>Windows (Edge) – jetzt aktiv</li>
              <li>iPhone – vor 2 Stunden</li>
              <li>MacBook – vor 1 Tag</li>
            </ul>
          </div>
        </section>
      </div>
    </UserSettingsLayout>
  );
}
