import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { User, Building2 } from "lucide-react"; // Icons!

export default function ModeSelection() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // State für Dialog und Eingabefeld
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    if (session.user?.mode === "solo") {
      router.replace("/solo-mode");
    } else if (session.user?.mode === "company") {
      router.replace("/company-mode");
    }
  }, [session]);

  useEffect(() => {
    if (showCompanyDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCompanyDialog]);

  const handleCompanyCreate = async () => {
    if (companyName.trim().length < 3) {
      setError("Der Firmenname muss mindestens 3 Zeichen haben.");
      return;
    }
    setError("");
    setShowCompanyDialog(false);

    await fetch("/api/user/set-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "company", companyName: companyName.trim() }),
    });

    await update();
    router.replace("/company-mode");
  };

  const handleClick = async (mode: "solo" | "company") => {
    if (mode === "company") {
      setShowCompanyDialog(true);
    } else {
      await fetch("/api/user/set-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      await update();
      router.replace("/solo-mode");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 relative">
      {/* Firmenname Dialog */}
      {showCompanyDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 min-w-[340px] border border-gray-200 dark:border-gray-700 relative backdrop-blur-xl animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Firma erstellen</h2>
            <input
              ref={inputRef}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800 dark:text-white text-lg mb-2 transition"
              placeholder="Firmenname eingeben"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleCompanyCreate();
              }}
            />
            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}
            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 bg-blue-600 text-white font-semibold rounded-xl px-4 py-2 hover:bg-blue-700 transition"
                onClick={handleCompanyCreate}
              >
                Erstellen
              </button>
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => { setShowCompanyDialog(false); setCompanyName(""); setError(""); }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Haupt-Auswahl (Cards) */}
      <div className="flex flex-col gap-6 w-full items-center">
        <div
          onClick={() => handleClick("solo")}
          className="w-80 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-7 shadow-lg transition duration-150 hover:shadow-2xl bg-white dark:bg-gray-900 group flex gap-3 items-center"
        >
          <User className="w-8 h-8 text-blue-500 mr-2 group-hover:scale-110 transition-transform" />
          <div>
            <h2 className="text-blue-700 dark:text-blue-400 text-lg font-bold mb-1">Nur für mich</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ich möchte meine eigenen Arbeitszeiten und Lohnabrechnungen verwalten.
            </p>
          </div>
        </div>
        <div
          onClick={() => handleClick("company")}
          className="w-80 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 rounded-2xl p-7 shadow-lg transition duration-150 hover:shadow-2xl bg-white dark:bg-gray-900 group flex gap-3 items-center"
        >
          <Building2 className="w-8 h-8 text-green-600 mr-2 group-hover:scale-110 transition-transform" />
          <div>
            <h2 className="text-green-700 dark:text-green-400 text-lg font-bold mb-1">
              Firma erstellen oder beitreten
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ich möchte ein Team verwalten, Kollegen einladen und zentrale Regeln festlegen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
