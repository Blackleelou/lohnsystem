// pages/join/[token].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import VisibilityConsentForm from "@/components/VisibilityConsentForm";

export default function JoinTokenPage() {
  const router = useRouter();
  const { token } = router.query;
  const { data: session, status, update } = useSession();
  const [stage, setStage] = useState<"loading" | "consent" | "join" | "done">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    // 1. Wenn noch nicht eingeloggt
    if (!session) {
      // Speichere den Token in sessionStorage, damit wir ihn nach Registrierung wieder abrufen können
      if (typeof window !== "undefined" && typeof token === "string") {
        sessionStorage.setItem("joinToken", token);
        // Weiterleiten nicht nur an /login, sondern an /login mit callback zu /register
        router.replace(`/login?callbackUrl=/register`);
      }
      return;
    }

    // 2. Wenn eingeloggt, aber gerade frisch von der Registrierung hierher gekommen:
    //    Falls wir in sessionStorage noch einen joinToken haben, setzen wir router so, dass wir neu auf diesen Join-Prozess gehen.
    if (session && !stage.startsWith("consent") && !stage.startsWith("join")) {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem("joinToken") : null;
      if (stored) {
        // Den Token „umleiten“ – jetzt sind wir eingeloggt, also zurück zu /join/[token]
        sessionStorage.removeItem("joinToken");
        router.replace(`/join/${stored}`);
        return;
      }
    }

    // 3. Nun sind wir sicher eingeloggt und evtl zurück zu /join/[token]. Prüfen, ob Datenschutzeinwilligung nötig:
    if (!session.user.hasChosenMode) {
      setStage("consent");
    } else {
      setStage("join");
    }
  }, [session, status, token, router, stage]);

  // Handler, wenn Consent‐Formular abgeschlossen ist
  async function handleConsentComplete() {
    await update(); // Session neu laden, damit hasChosenMode auf true steht
    setStage("join");
  }

  // Einladung einlösen
  useEffect(() => {
    if (stage !== "join" || !token || typeof token !== "string") return;

    fetch("/api/team/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStage("done");
          setMessage("Beitritt erfolgreich! Du wirst weitergeleitet …");
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setStage("done");
          setMessage(data.error || "Einladungslink ungültig oder abgelaufen.");
        }
      })
      .catch(() => {
        setStage("done");
        setMessage("Ein unerwarteter Fehler ist aufgetreten.");
      });
  }, [stage, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md bg-white p-6 rounded shadow text-center">
        {stage === "loading" && <p>Einladung wird geprüft …</p>}

        {stage === "consent" && (
          <>
            <h1 className="text-xl font-bold mb-2">Datenschutz-Einstellungen</h1>
            <VisibilityConsentForm onComplete={handleConsentComplete} />
          </>
        )}

        {stage === "join" && <p>Einladung wird eingelöst …</p>}

        {stage === "done" && (
          <>
            {message.startsWith("Beitritt") ? (
              <h1 className="text-green-600 font-bold text-xl mb-2">Erfolg</h1>
            ) : (
              <h1 className="text-red-600 font-bold text-xl mb-2">Fehler</h1>
            )}
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
