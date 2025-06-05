import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function TeamInviteGenerator() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [role, setRole] = useState("viewer");
  const [expiresIn, setExpiresIn] = useState(720); // max. 30 Tage
  const [withPassword, setWithPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // einfache mobile Detection ohne extra Paket
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipad|android|mobile/.test(ua));
    }
  }, []);

  const handleCreateQRCode = async () => {
    setLoading(true);
    setInviteUrl("");

    try {
      const res = await fetch("/api/team/create-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          expiresInHours: expiresIn,
          password: withPassword ? password : null,
          note,
        }),
      });

      const data = await res.json();
      if (data.code) {
        setInviteUrl(`https://meinlohn.app/team/join/${data.code}`);
      } else {
        alert("Fehler beim Erstellen.");
      }
    } catch (err) {
      console.error(err);
      alert("Unerwarteter Fehler.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Team-Einladung",
        text: "Hier ist dein Zugang zum Team",
        url: inviteUrl,
      });
    } else {
      navigator.clipboard.writeText(inviteUrl);
      alert("Link kopiert!");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Team-Zugang erstellen</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Rolle:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Gültigkeit (in Stunden):</label>
          <input
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min={1}
            max={720}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={withPassword}
            onChange={(e) => setWithPassword(e.target.checked)}
          />
          Zugang benötigt Passwort
        </label>

        {withPassword && (
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="z. B. 4Z9G6B"
          />
        )}

        <label className="block font-semibold">Persönliche Nachricht (optional):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded"
          rows={2}
          placeholder="Hinweise für neue Teammitglieder"
        />

        <button
          onClick={handleCreateQRCode}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Wird erstellt..." : "QR-Code erzeugen"}
        </button>
      </div>

      {inviteUrl && (
        <div className="mt-6 text-center border-t pt-6">
          <QRCode value={inviteUrl} className="mx-auto bg-white p-4" />
          <p className="mt-2 text-sm break-all">{inviteUrl}</p>

          {note && (
            <p className="mt-2 italic text-gray-600 border-t pt-2">{note}</p>
          )}

          <button
            onClick={() => window.print()}
            className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Als A4 ausdrucken
          </button>

          <hr className="my-4" />

          <h3 className="font-semibold text-lg mb-2">Oder per Link einladen</h3>
          <button
            onClick={handleShareLink}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {isMobile ? "Per WhatsApp oder E-Mail teilen" : "Link kopieren & versenden"}
          </button>
        </div>
      )}
    </div>
  );
}
