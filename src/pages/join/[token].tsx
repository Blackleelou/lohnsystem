import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function JoinTokenPage() {
  const router = useRouter();
  const { token } = router.query;
  const { data: session, status: sessionStatus } = useSession();

  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    if (sessionStatus === "loading") return;

    // 👇 nicht eingeloggt → Login-Seite mit Rücksprung
    if (!session) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("joinToken", token);
      }
      router.push(`/login?callbackUrl=/join/${token}`);
      return;
    }

    // 👇 eingeloggt: Einladung einlösen
    fetch("/api/team/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung...");
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setStatus("error");
          setMessage(data.error || "Einladungslink ungültig oder abgelaufen.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Ein unerwarteter Fehler ist aufgetreten.");
      });
  }, [token, session, sessionStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
      <div className="max-w-md bg-white p-6 rounded shadow">
        {status === "checking" && <p>Einladung wird geprüft…</p>}
        {status === "success" && (
          <>
            <h1 className="text-green-600 font-bold text-xl mb-2">Beitritt erfolgreich</h1>
            <p>{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-red-600 font-bold text-xl mb-2">Fehler</h1>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
