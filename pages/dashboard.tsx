import Layout from "@/components/Layout";
import ModeSelection from "@/components/onboarding/ModeSelection";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [statusText, setStatusText] = useState("");

  const userMode = session?.user?.mode;

  const handleModeSelect = async (mode: "solo" | "company") => {
    setStatusText("Modus wird gespeichert...");
    const res = await fetch("/api/user/set-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });

    if (res.ok) {
      setStatusText("Modus gespeichert – Seite wird neu geladen...");
      setTimeout(() => {
        router.reload();
      }, 1000); // etwas Verzögerung für Anzeige
    } else {
      setStatusText("Fehler beim Speichern des Modus.");
    }
  };

  if (status === "loading") return <div className="p-4">Lade Benutzerdaten...</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Modusanzeige */}
        {userMode && !isChanging && (
          <div className="text-sm text-right text-gray-500">
            Aktueller Modus:{" "}
            <span className="font-semibold text-gray-700">
              {userMode === "solo" ? "Solo-Modus" : "Firmen-Modus"}
            </span>
            <button
              className="ml-2 text-blue-600 hover:underline text-sm"
              onClick={() => setIsChanging(true)}
            >
              Modus ändern
            </button>
          </div>
        )}

        {/* Auswahl */}
        {isChanging || !userMode ? (
          <>
            <ModeSelection onSelect={handleModeSelect} />
            {statusText && (
              <div className="mt-4 text-center text-sm text-gray-600">{statusText}</div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-700">Hier kommt deine Lohnübersicht hin.</p>
          </>
        )}
      </div>
    </Layout>
  );
}
