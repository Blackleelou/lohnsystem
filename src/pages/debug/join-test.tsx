// pages/debug-join.tsx

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DebugJoinPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [stage, setStage] = useState<
    "init" | "missingToken" | "validated" | "waitingConsent" | "joinSuccess" | "joinError" | "validateError" | "exception"
  >("init");

  const logStep = (text: string) => setLog((prev) => [...prev, text]);

  useEffect(() => {
    const tokenRaw = router.query.token;
    const parsedToken = typeof tokenRaw === "string" ? tokenRaw : Array.isArray(tokenRaw) ? tokenRaw[0] : null;
    setToken(parsedToken ?? null);
  }, [router.query.token]);

  useEffect(() => {
    if (!token) {
      setStage("missingToken");
      logStep("Kein gültiger Token vorhanden.");
      return;
    }

    if (sessionStatus === "loading") {
      logStep("Session wird geladen…");
      return;
    }

    if (!session) {
      logStep("Nicht eingeloggt → simulate validate ohne session.");
    } else {
      logStep(`Eingeloggt als ${session.user?.email || session.user?.name || "Unbekannt"}`);
    }

    const validate = async () => {
      try {
        logStep(`Sende Anfrage an /api/team/validate-invite?token=${token}`);
        const res = await fetch(`/api/team/validate-invite?token=${token}`);

        if (!res.ok) {
          setStage("validateError");
          logStep(`FEHLER bei validate-invite: Status ${res.status}`);
          return;
        }

        const data = await res.json();
        setCompanyName(data.companyName || null);
        setStage("validated");
        logStep("Einladung gültig. Kein Redirect, nur Debug-Ausgabe.");
        logStep(JSON.stringify({ status: res.status, json: data }, null, 2));
      } catch (err) {
        setStage("exception");
        logStep("Exception beim Validieren: " + (err instanceof Error ? err.message : String(err)));
      }
    };

    validate();
  }, [token, session, sessionStatus]);

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-sm font-mono">
      <h1 className="text-xl font-bold mb-4">Testseite: Join-Token Debug</h1>
      <p><strong>Session:</strong> {sessionStatus} {session?.user?.email ? `(${session.user.email})` : ""}</p>
      <p><strong>Token:</strong> {token || "(nicht gefunden)"}</p>
      <p><strong>Status:</strong> {stage}</p>
      <p><strong>Company:</strong> {companyName || "-"}</p>

      <div className="mt-4 p-4 bg-white shadow rounded">
        <h2 className="font-semibold mb-2">Logausgabe:</h2>
        <ul className="space-y-1">
          {log.map((entry, i) => (
            <li key={i}>• {entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
