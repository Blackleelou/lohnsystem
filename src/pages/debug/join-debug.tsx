// pages/test/join-debug.tsx

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function JoinTokenDebugPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  const log = (msg: string) => {
    setLogs((prev) => [...prev, `• ${msg}`]);
  };

  const checkToken = async () => {
    setLogs([]);
    setResult(null);
    setLoading(true);

    try {
      log("🟡 [Frontend] Einladung wird überprüft…");

      if (sessionStatus === "loading") {
        log("⚠️ Session wird noch geladen…");
        return;
      }

      if (sessionStatus === "unauthenticated") {
        log("❌ Nicht eingeloggt – Beitritt nicht möglich.");
        log("📢 Anzeige im echten Frontend: Einladung ungültig oder abgelaufen");
      }

      if (sessionStatus === "authenticated") {
        log(`✅ Eingeloggt als ${session?.user?.email}`);
      }

      if (!token || token.length < 10) {
        log("❌ Kein gültiger Token eingegeben.");
        setResult({ status: 400, json: { reason: "Ungültiger Token" } });
        log("📢 Anzeige im echten Frontend: Einladung ungültig oder abgelaufen");
        return;
      }

      log(`🔎 Sende Anfrage an /api/test/check-token?token=${token}`);
      const res = await fetch(`/api/test/check-token?token=${token}`);
      const json = await res.json();
      setResult({ status: res.status, json });

      if (!res.ok) {
        log(`⚠️ Prüfung fehlgeschlagen: ${json.reason || "Unbekannter Fehler"}`);
        log("📢 Anzeige im echten Frontend: Einladung ungültig oder abgelaufen");
        return;
      }

      log(`✅ Token-Status: ${json.status} (${json.reason})`);

      if (json.status !== "valid") {
        log("🚫 Kein Beitritt möglich, da Token nicht gültig.");
        log("📢 Anzeige im echten Frontend: Einladung ungültig oder abgelaufen");
        return;
      }

      if (sessionStatus === "authenticated") {
        log("🟢 [Frontend] Sichtbarkeitsabfrage wird eingeblendet…");
        log("➡️ Simuliere Beitritt mit gültiger Session…");

        const joinRes = await fetch("/api/team/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const joinJson = await joinRes.json();

        if (joinRes.ok && joinJson.success) {
          log("✅ [Backend] Beitritt erfolgreich. Benutzer wurde aktualisiert.");
          log("📢 Anzeige im echten Frontend: Beitritt erfolgreich");
        } else {
          log(`❌ Beitritt fehlgeschlagen: ${joinJson.error || "Unbekannter Fehler"}`);
          log("📢 Anzeige im echten Frontend: Einladung ungültig oder abgelaufen");
        }

        log("🟡 [Frontend] Einladung wird erneut überprüft (vermutlich wegen Redirect-Trigger)");
        log("🔁 Achtung: Token könnte zu diesem Zeitpunkt bereits gelöscht sein");

        const retryRes = await fetch(`/api/test/check-token?token=${token}`);
        if (retryRes.status === 410) {
          log("🔴 [Backend] Token wurde bereits verwendet oder gelöscht");
          log("📢 Anzeige im echten Frontend: ❌ Einladung ungültig oder abgelaufen (fälschlich nach Erfolg)");
        }
      }
    } catch (err: any) {
      log(`💥 Fehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center space-y-6">
      <h1 className="text-2xl font-bold">Testseite: Join-Token Debug</h1>

      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow text-left">
        <h2 className="text-lg font-semibold mb-2">1. Session-Status</h2>
        {sessionStatus === "loading" && <p>Lade Session-Daten…</p>}
        {sessionStatus === "unauthenticated" && <p>❌ Nicht eingeloggt</p>}
        {sessionStatus === "authenticated" && (
          <p>✅ Eingeloggt als: <strong>{session.user?.email}</strong></p>
        )}
      </div>

      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow text-left">
        <h2 className="text-lg font-semibold mb-2">2. Token prüfen & Beitritt simulieren</h2>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token eingeben..."
          className="p-2 rounded border w-full mb-4"
        />
        <button
          onClick={checkToken}
          disabled={loading || token.length < 10}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Prüfen & Simulieren
        </button>

        {loading && <p className="mt-4">🔄 Lade…</p>}

        {result && (
          <div className="mt-6">
            <p><strong>Status:</strong> {result.status}</p>
            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(result.json, null, 2)}
            </pre>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-2">Logausgabe:</h3>
            <ul className="text-sm space-y-1">
              {logs.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
