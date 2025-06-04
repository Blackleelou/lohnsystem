import { useSession } from "next-auth/react";
import SuperadminLayout from "@/components/superadmin/SuperadminLayout";
import { useState } from "react";

export default function DebugPage() {
  const { data: session, status, update } = useSession();
  const [testApiResult, setTestApiResult] = useState<string | null>(null);

  // Beispiel: API-Test
  async function handleTestApi() {
    setTestApiResult("Lade...");
    try {
      const res = await fetch("/api/test-endpoint");
      const data = await res.json();
      setTestApiResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setTestApiResult("Fehler: " + String(e));
    }
  }

  if (status === "loading") return <div>Lade Session...</div>;
  if (!session || session.user.email !== "jantzen.chris@gmail.com") {
    return <div>Kein Zugriff.</div>;
  }

  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto mt-10 px-4 text-sm">
        <h1 className="text-xl font-bold mb-4">Debug & Tools</h1>

        {/* 1. Session/Profil */}
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Session & Userdaten</h2>
          <pre className="bg-gray-100 p-3 rounded text-xs">
            {JSON.stringify(session, null, 2)}
          </pre>
        </section>

        {/* 1b. Analyse: Rollen- und Firmenstatus */}
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Analyse: Rolle & Team</h2>
          <div className="bg-white border rounded p-4 text-sm space-y-2">
            {session?.user?.companyId ? (
              <p>
                ✅ Zugewiesen zu Firma:{" "}
                <code>{session.user.companyId}</code>
              </p>
            ) : (
              <p className="text-red-600">
                ❌ Kein Team zugewiesen (<code>companyId</code> fehlt)
              </p>
            )}

            {session?.user?.role ? (
              <>
                <p>✅ Rolle erkannt: <strong>{session.user.role}</strong></p>
                {session.user.role !== "admin" && (
                  <p className="text-yellow-600">
                    ⚠️ Du bist kein Admin – eingeschränkte Rechte für Teamfunktionen.
                  </p>
                )}
              </>
            ) : (
              <p className="text-red-600">
                ❌ Keine Rolle gesetzt (<code>role</code> ist null oder fehlt)
              </p>
            )}
          </div>
        </section>

        {/* 2. API-Test */}
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">API-Test (Demo)</h2>
          <button
            onClick={handleTestApi}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Test /api/test-endpoint
          </button>
          {testApiResult && (
            <pre className="bg-gray-100 p-3 rounded text-xs mt-2">
              {testApiResult}
            </pre>
          )}
        </section>

        {/* 3. Weitere Tools hier */}
      </div>
    </SuperadminLayout>
  );
}
