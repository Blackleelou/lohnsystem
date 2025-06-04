import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"; // Session-Funktion importieren

export default function CreateCompanyForm() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { update } = useSession(); // <- Session-Aktualisierung nutzen

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Unbekannter Fehler");
        setLoading(false);
        return;
      }

      // ✅ Session aktualisieren, damit companyId + role verfügbar sind
      await update();

      // 🔁 Danach weiterleiten z. B. ins Dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Fehler beim Erstellen der Firma:", err);
      setErrorMsg("Netzwerk- oder Serverfehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 border rounded shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Neue Firma anlegen</h2>

      <label className="block mb-2 font-medium text-sm">Firmenname</label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4 dark:bg-gray-800"
        required
      />

      {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Wird erstellt..." : "Firma erstellen"}
      </button>
    </form>
  );
}
