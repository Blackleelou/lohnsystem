import SuperadminLayout from "@/components/SuperadminLayout";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DebugModeSwitchPage() {
  const { data: session, status, update } = useSession();
  const [currentMode, setCurrentMode] = useState<"solo" | "company" | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);

  const addLog = (msg: string) =>
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} – ${msg}`]);

  useEffect(() => {
    if (!session) {
      addLog("[Session] Keine aktive Session gefunden");
      return;
    }

    if (session.user?.mode === "solo" || session.user?.mode === "company") {
      setCurrentMode(session.user.mode);
      addLog(`[Session] Modus erkannt: ${session.user.mode}`);
    } else {
      addLog("[Session] Kein Modus in session.user.mode");
    }

    addLog(`[Session] Vollständige Session: ${JSON.stringify(session, null, 2)}`);
  }, [session]);

  const toggleMode = async (openNewTab = false) => {
    if (!currentMode || !session) {
      addLog("[Toggle] Kein gültiger Modus in Session gefunden – Abbruch");
      return;
    }

    const nextMode = currentMode === "solo" ? "company" : "solo";
    addLog(`[Toggle] Starte Wechsel: ${currentMode} → ${nextMode}`);
    setLoading(true);

    try {
      const res = await fetch("/api/user/set-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });

      if (!res.ok) {
        const error = await res.json();
        addLog(`[Serverfehler] ${JSON.stringify(error)}`);
        return;
      }

      addLog(`[API] Modus gespeichert, führe update() mit Patch aus...`);

      const result = await update({
        ...session,
        user: {
          ...session.user,
          mode: nextMode,
        },
      });

      setUpdateResult(result);
      addLog(`[update()] Rückgabe: ${JSON.stringify(result, null, 2)}`);

      if (openNewTab) {
        addLog(`[Test] Öffne neuen Tab: /${nextMode}-mode`);
        window.open(`/${nextMode}-mode`, "_blank");
      } else {
        addLog(`[Test] KEIN echter Wechsel – bleibe auf Debug-Seite`);
      }
    } catch (err: any) {
      addLog(`[Catch] Fehler beim Toggle: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadLog = () => {
    const blob = new Blob([log.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-modus-log-${new Date().toISOString()}.txt`;
    a.click();
  };

  if (status === "loading") return <p className="p-4">Lade Session...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 text-sm">
      <h1 className="text-xl font-bold mb-4">Debug: Moduswechsel</h1>

      <div className="mb-4 bg-white rounded shadow p-4 border">
        <p><strong>Aktueller Modus:</strong> {session?.user?.mode || "Unbekannt"}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Status:</strong> {status}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => toggleMode(false)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Wechsle..." : "Modus wechseln (Debug intern)"}
          </button>
          <button
            onClick={() => toggleMode(true)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Öffne..." : "Modus wechseln + Seite öffnen"}
          </button>
          <button
            onClick={downloadLog}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Log speichern
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-3 rounded text-xs max-h-96 overflow-y-auto whitespace-pre-wrap font-mono border">
        {log.length === 0 ? <p>Keine Einträge.</p> : log.map((line, idx) => (
          <p key={idx} className="mb-1">{line}</p>
        ))}
      </div>

      {updateResult && (
        <div className="bg-yellow-100 p-3 mt-4 rounded border text-xs font-mono">
          <strong>update() Rückgabe:</strong>
          <pre>{JSON.stringify(updateResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
// Datei: pages/debug-mode.tsx (nur dich zulassen)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user?.email !== "jantzen.chris@gmail.com") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
DebugModeSwitchPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
