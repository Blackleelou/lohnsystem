import Layout from "@/components/Layout";
import ModeSelection from "@/components/onboarding/ModeSelection";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showGoogleHint, setShowGoogleHint] = useState(false);

  const userMode = session?.user?.mode;
  const handleModeSelect = (mode: "solo" | "company") => {
    console.log("Ausgewählt:", mode);
    // Später hier: API-Call zur Speicherung des Modus
  };

  useEffect(() => {
    if (router.query.justSignedIn === "google") {
      setShowGoogleHint(true);
      setTimeout(() => {
        setShowGoogleHint(false);
        const { justSignedIn, ...rest } = router.query;
        router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
      }, 5000);
    }
  }, [router]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {userMode && (
          <div className="text-sm text-right text-gray-500">
            Aktueller Modus:{" "}
            <span className="font-semibold text-gray-700">
              {userMode === "solo" ? "Solo-Modus" : "Firmen-Modus"}
            </span>
          </div>
        )}

        {!userMode ? (
          <ModeSelection onSelect={handleModeSelect} />
        ) : (
          <>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-700">Hier kommt deine Lohnübersicht hin.</p>

            {showGoogleHint && (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md border border-yellow-300 mb-4 text-sm shadow">
                Hinweis: Du bist mit deinem <strong>Google-Konto</strong> angemeldet.
                Ein separates Passwort ist nicht erforderlich.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
