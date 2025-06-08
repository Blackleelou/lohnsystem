// src/pages/debug/validate-test.tsx

import { useState } from "react";

export default function ValidateTestPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    setResult(null);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch(`/api/team/validate-invite?token=${token}`);
      setStatus(res.status);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unbekannter Fehler");
        console.warn("Fehlerhafte Antwort:", data);
      } else {
        setResult(data);
        console.log("Erfolg:", data);
      }
    } catch (err) {
      setError("Netzwerkfehler oder ungültige Antwort");
      console.error("Fehler:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-xl font-bold">Token-Test: validate-invite</h1>

        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token hier einfügen"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          onClick={handleValidate}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Testen
        </button>

        {status && (
          <div className="text-sm text-gray-600">
            <strong>Status:</strong> {status}
          </div>
        )}

        {error && (
          <div className="text-red-600">
            <strong>Fehler:</strong> {error}
          </div>
        )}

        {result && (
          <div className="text-green-600 whitespace-pre-wrap">
            <strong>Antwort:</strong>{" "}
            {JSON.stringify(result, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
