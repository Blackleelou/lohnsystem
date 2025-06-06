// src/pages/join/[token].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import VisibilityConsentForm from "@/components/VisibilityConsentForm";

export default function JoinTokenPage() {
  const router = useRouter();
  const { token } = router.query;
  const { data: session, status: sessionStatus, update } = useSession({
    required: false,
    // alle 30 Sekunden neu abfragen, ob sich die Session verändert hat
    refetchInterval: 30,
    refetchOnWindowFocus: true,
  });

  // Lokale States für Consent‐Logik
  const [hasConsent, setHasConsent] = useState(false);
  const [consentData, setConsentData] = useState<{
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  } | null>(null);

  // Lifecycle‐State: "checking" | "waitingConsent" | "success" | "error"
  const [stage, setStage] = useState<
    "checking" | "waitingConsent" | "success" | "error"
  >("checking");
  const [message, setMessage] = useState("");

  // 1) Effekt: Sobald token, session & sessionStatus bekannt sind, steuern wir die Consent‐ und Join‐Logik
  useEffect(() => {
    if (!token || typeof token !== "string") return;
    if (sessionStatus === "loading") return;

    // a) Ist der User noch nicht eingeloggt?
    if (!session) {
      // Speichere den Token zwischen (z. B. nach Registrierung wiederverwenden) und leite auf Login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("joinToken", token);
      }
      router.push(`/login?callbackUrl=/join/${token}`);
      return;
    }

    // b) Ist der User eingeloggt, aber hat noch keine Consent‐Daten abgegeben?
    if (!hasConsent) {
      setStage("waitingConsent");
      return;
    }

    // c) Eingeloggt + Consent abgegeben → Einladung einlösen
    setStage("checking");
    fetch("/api/team/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // hier übergeben wir Token + Consent‐Daten ans Backend
      body: JSON.stringify({ token, ...consentData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStage("success");
          setMessage("Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung…");
          // Session neu laden, damit Navbar etc. sofort die neue companyId kennen
          update();
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setStage("error");
          setMessage(data.error || "Einladungslink ungültig oder abgelaufen.");
        }
      })
      .catch(() => {
        setStage("error");
        setMessage("Ein unerwarteter Fehler ist aufgetreten.");
      });
  }, [token, session, sessionStatus, hasConsent, consentData, router, update]);

  // 2) Falls der User gerade frisch registriert wurde: Token aus sessionStorage holen und erneut auf /join/[token] leiten
  useEffect(() => {
    if (session && !token && typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("joinToken");
      if (storedToken) {
        router.replace(`/join/${storedToken}`);
      }
    }
  }, [session, token, router]);

  // Callback, den wir an <VisibilityConsentForm> übergeben:
  function handleConsentSubmit(data: {
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) {
    setConsentData(data);
    setHasConsent(true);
  }

  // 3) Hier rendern wir je nach Stage den passenden Screen:

  if (stage === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <p>Einladung wird geprüft…</p>
        </div>
      </div>
    );
  }

  if (stage === "waitingConsent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
        <VisibilityConsentForm onSubmit={handleConsentSubmit} />
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-green-600 font-bold text-xl mb-2">Beitritt erfolgreich</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-red-600 font-bold text-xl mb-2">Fehler</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  // Sollte eigentlich nie hier landen – aber für die Typsicherheit geben wir null zurück
  return null;
}
