// src/pages/join/[token].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import VisibilityConsentForm from "@/components/VisibilityConsentForm";

export default function JoinTokenPage() {
  const router = useRouter();
  const { token } = router.query;

  // 1) useSession ohne refetchInterval/refetchOnWindowFocus
  // Achtung: „required: false“ ist zwar Standard, aber wir setzen es hier explizit,
  // damit TS weiß, dass session auch undefined sein kann.
  const { data: session, status: sessionStatus, update } = useSession({
    required: false,
  });

  // 2) Polling: alle 30 Sekunden Session.update() ausführen
  useEffect(() => {
    const handle = setInterval(() => {
      update();
    }, 30 * 1000); // 30 Sekunden

    return () => clearInterval(handle);
  }, [update]);

  // 3) Consent-Logik (lokal, da wir kein session.user.hasChosenMode mehr haben)
  const [hasConsent, setHasConsent] = useState(false);
  const [consentData, setConsentData] = useState<{
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  } | null>(null);

  const [stage, setStage] = useState<
    "checking" | "waitingConsent" | "success" | "error"
  >("checking");
  const [message, setMessage] = useState("");

  // 4) Haupt-Effect: Sobald token + session bekannt sind, Consent- oder Join-Flow starten
  useEffect(() => {
    if (!token || typeof token !== "string") return;
    if (sessionStatus === "loading") return;

    // a) Nicht eingeloggt → Login + Token in sessionStorage zwischenspeichern
    if (!session) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("joinToken", token);
      }
      router.push(`/login?callbackUrl=/join/${token}`);
      return;
    }

    // b) Eingeloggt aber noch keine Consent-Daten abgegeben → Consent-Formular anzeigen
    if (!hasConsent) {
      setStage("waitingConsent");
      return;
    }

    // c) Eingeloggt + Consent abgegeben → Einladung einlösen
    setStage("checking");
    fetch("/api/team/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...consentData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStage("success");
          setMessage("Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung…");
          // Session sofort neu laden, damit navbar o. Ä. sofort die neue companyId kennt
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

  // 5) Falls nach der Registrierung plötzlich session ankommt und token fehlt:
  useEffect(() => {
    if (session && !token && typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("joinToken");
      if (storedToken) {
        router.replace(`/join/${storedToken}`);
      }
    }
  }, [session, token, router]);

  // 6) Callback für das Consent-Formular
  function handleConsentSubmit(data: {
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) {
    setConsentData(data);
    setHasConsent(true);
  }

  // 7) Je nach stage das passende UI rendern
  if (stage === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <p>Einladung wird geprüft…</p>
        </div>
      </div>
    );
  }

  if (stage === "waitingConsent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <VisibilityConsentForm onSubmit={handleConsentSubmit} />
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-green-600 font-bold text-xl mb-2">Beitritt erfolgreich</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-red-600 font-bold text-xl mb-2">Fehler</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return null;
}
