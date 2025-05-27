import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ModeSwitch() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localMode, setLocalMode] = useState<"solo" | "company" | null>(null);

  useEffect(() => {
    if (session?.user?.mode === "solo" || session?.user?.mode === "company") {
      setLocalMode(session.user.mode);
    }
  }, [session]);

  const toggleMode = async () => {
    if (!localMode) return;
    const nextMode = localMode === "solo" ? "company" : "solo";

    setLoading(true);

    try {
      const res = await fetch("/api/user/set-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });

      if (!res.ok) {
        alert("Fehler beim Umschalten des Modus");
        return;
      }

      // Jetzt Session aktualisieren – wichtig: token.email muss im JWT gesetzt sein!
      const updated = await update();
      const newMode = updated?.user?.mode;

      if (newMode === "solo" || newMode === "company") {
        setLocalMode(newMode);
        router.push(`/${newMode}-mode`);
      }

    } catch (err) {
      console.error("Fehler beim Moduswechsel:", err);
      alert("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !localMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <div
        onClick={toggleMode}
        className={`w-14 h-8 flex items-center ${
          localMode === "company" ? "bg-green-500" : "bg-blue-500"
        } rounded-full p-1 cursor-pointer transition duration-300`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            localMode === "company" ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-xs text-gray-600 mt-1 pr-1">
        {loading
          ? "Wechsle..."
          : localMode === "company"
          ? "Firmamodus aktiv"
          : "Einzelmodus aktiv"}
      </span>
    </div>
  );
}
