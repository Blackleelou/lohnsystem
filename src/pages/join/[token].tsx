// src/pages/join/[token].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import VisibilityConsentForm from "@/components/VisibilityConsentForm";

export default function JoinTokenPage() {
  const router = useRouter();
  const rawToken = router.query.token;
  const token = typeof rawToken === "string" ? rawToken : Array.isArray(rawToken) ? rawToken[0] : null;
  const [companyName, setCompanyName] = useState<string | null>(null);

  const { data: session, status: sessionStatus, update } = useSession({ required: false });

  useEffect(() => {
    const handle = setInterval(() => {
      update();
    }, 30 * 1000);
    return () => clearInterval(handle);
  }, [update]);

  const [hasConsent, setHasConsent] = useState(false);
  const [consentData, setConsentData] = useState<{
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  } | null>(null);

  const [stage, setStage] = useState<"checking" | "waitingConsent" | "success" | "error">("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || typeof token !== "string" || token.length < 10) return;

    let activeToken: string | null = token;
    if (!activeToken && typeof window !== "undefined") {
      activeToken = sessionStorage.getItem("joinToken");
    }
    if (!activeToken || activeToken.length < 10) return;
    if (sessionStatus === "loading") return;

    if (!session) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("joinToken", token);
      }
      router.push(`/login?callbackUrl=/join/${token}`);
      return;
    }

    const validateAndContinue = async () => {
      setStage("checking");

      try {
        const res = await fetch(`/api/team/validate-invite?token=${activeToken}`);
        if (!res.ok) {
          console.warn("FEHLER bei validate-invite:", res.status);
          setStage("error");
          setMessage("Einladungslink ungültig oder abgelaufen.");
          return;
        }

        const data = await res.json();
        setCompanyName(data.companyName || null);
        console.log("validate-invite response:", data);

        if (!hasConsent) {
          setStage("waitingConsent");
          return;
        }

        const joinRes = await fetch("/api/team/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: activeToken, ...consentData }),
        });

        if (!joinRes.ok) {
          setStage("error");
          setMessage("Fehler beim Beitritt. Bitte versuche es erneut.");
          return;
        }

        const joinData = await joinRes.json();

        if (joinData?.success) {
          setStage("success");
          setMessage("Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung…");
          update();
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setStage("error");
          setMessage(joinData?.error || "Einladung fehlgeschlagen oder bereits verwendet.");
        }
      } catch (err) {
        console.error("Fehler beim Validieren oder Beitreten:", err);
        setStage("error");
        setMessage("Ein unerwarteter Fehler ist aufgetreten.");
      }
    };

    validateAndContinue();
  }, [token, session, sessionStatus, hasConsent, consentData, router, update]);

  useEffect(() => {
    if (session && !token && typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("joinToken");
      if (storedToken) {
        router.replace(`/join/${storedToken}`);
      }
    }
  }, [session, token, router]);

  function handleConsentSubmit(data: {
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) {
    setConsentData(data);
    setHasConsent(true);
  }

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
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Willkommen bei meinLohn!</h1>
          {companyName && (
            <p className="text-gray-600">
              Du wurdest in das Team <span className="font-semibold text-gray-800">{companyName}</span> eingeladen.
            </p>
          )}
          <p className="text-gray-600">Bitte wähle, welche deiner Daten im Team sichtbar sein sollen:</p>
          <VisibilityConsentForm onSubmit={handleConsentSubmit} />
        </div>
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
