import { useState } from "react";

export default function AccessCodePanel() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [expiresIn, setExpiresIn] = useState(24);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleCreateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/create-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, expiresInHours: expiresIn, role }),
      });

      const data = await res.json();
      if (res.ok && data.code) {
        setGeneratedCode(data.code);
      } else {
        alert("Fehler beim Erstellen");
      }
    } catch (err) {
      console.error(err);
      alert("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-bold mb-4">Zugangs-Code erstellen</h2>

      <label className="block font-medium mb-1">Rolle:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mb-3 p-2 border rounded">
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <label className="block font-medium mb-1">Passwort (optional):</label>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        placeholder="Optional"
      />

      <label className="block font-medium mb-1">Gültigkeit (in Stunden):</label>
      <input
        type="number"
        value={expiresIn}
        onChange={(e) => setExpiresIn(Number(e.target.value))}
        className="w-full mb-3 p-2 border rounded"
        min={1}
        max={168}
      />

      <button
        onClick={handleCreateCode}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Erstelle..." : "Code generieren"}
      </button>

      {generatedCode && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-center">
          <p className="font-bold mb-1">Zugangscode:</p>
          <p className="text-xl font-mono">{generatedCode}</p>
          <button
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => navigator.clipboard.writeText(generatedCode)}
          >
            Code kopieren
          </button>
        </div>
      )}
    </div>
  );
}
