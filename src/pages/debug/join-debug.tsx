// pages/test/join-debug.tsx

import { useState } from "react";

export default function JoinTokenDebugPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/test/check-token?token=${token}`);
      const json = await res.json();
      setResult({ status: res.status, json });
    } catch (err) {
      setResult({ error: "Fehler beim Abrufen." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Testseite: Join-Token Debug</h1>

      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token eingeben..."
        className="p-2 rounded border w-full max-w-md mb-4"
      />
      <button
        onClick={checkToken}
        disabled={loading || token.length < 10}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Prüfen
      </button>

      {loading && <p className="mt-4">Lade...</p>}

      {result && (
        <div className="mt-6 text-left max-w-xl mx-auto bg-white p-4 rounded shadow">
          <p><strong>Status:</strong> {result.status}</p>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(result.json, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
