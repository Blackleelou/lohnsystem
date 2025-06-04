import { useState } from "react";
import QRCode from "react-qr-code";

export default function TeamInviteGenerator() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [role, setRole] = useState("viewer");
  const [expiresIn, setExpiresIn] = useState(48); // in Stunden
  const [loading, setLoading] = useState(false);

  const handleCreateInvite = async () => {
    setLoading(true);
    setInviteUrl("");

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, expiresInHours: expiresIn }),
      });

      const data = await res.json();

      if (data.success && data.invitation?.joinUrl) {
        setInviteUrl(data.invitation.joinUrl);
      } else {
        alert(data.message || "Fehler beim Erstellen des Einladungslinks.");
      }
    } catch (err) {
      console.error("Fehler beim Einladungslink erstellen:", err);
      alert("Unerwarteter Fehler beim Erstellen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-lg mx-auto bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Team-Einladung erstellen</h2>

      <label className="block mb-1 font-semibold">Rolle:</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <label className="block mb-1 font-semibold">Gültigkeit (in Stunden):</label>
      <input
        type="number"
        value={expiresIn}
        onChange={(e) => setExpiresIn(Number(e.target.value))}
        className="w-full mb-4 p-2 border rounded"
        min={1}
        max={168}
      />

      <button
        onClick={handleCreateInvite}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Wird erstellt..." : "Einladungslink erzeugen"}
      </button>

      {inviteUrl && (
        <div className="mt-6 text-center">
          <h3 className="font-bold mb-2">Dein Einladungslink:</h3>
          <p className="break-all text-sm bg-gray-100 p-2 rounded">{inviteUrl}</p>
          <button
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => navigator.clipboard.writeText(inviteUrl)}
          >
            Link kopieren
          </button>

          <div className="mt-6 bg-white p-4 inline-block">
            <QRCode value={inviteUrl} />
          </div>

          <button
            className="mt-4 block text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => window.print()}
          >
            QR-Code drucken
          </button>
        </div>
      )}
    </div>
  );
}
