
import TeamLayout from "@/components/team/TeamLayout";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function TeamInviteGenerator() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [role, setRole] = useState("viewer");
  const [expiresIn, setExpiresIn] = useState(720); // 30 Tage
  const [withPassword, setWithPassword] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateInvite = async () => {
    setLoading(true);
    setInviteUrl("");

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          expiresInHours: expiresIn,
          withPassword,
          note,
        }),
      });

      const data = await res.json();
      if (data.success && data.invitation?.joinUrl) {
        setInviteUrl(data.invitation.joinUrl);
      } else {
        alert(data.message || "Fehler beim Erstellen des Einladungslinks.");
      }
    } catch (err) {
      alert("Verbindungsfehler beim Erstellen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Einladung erstellen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- QR-CODE EINLADUNG --- */}
        <div className="bg-white shadow rounded p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">QR-Code mit optionalem Passwort</h2>

          <label className="block mb-2 font-medium">Rolle im Team</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>

          <label className="block mb-2 font-medium">Gültigkeit (Stunden)</label>
          <input
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="w-full mb-4 p-2 border rounded"
            min={1}
            max={720}
          />

          <label className="block mb-2 font-medium">Hinweis (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full mb-4 p-2 border rounded"
            placeholder="z. B. Für neue Aushilfen im Lager"
          />

          <label className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              checked={withPassword}
              onChange={(e) => setWithPassword(e.target.checked)}
              className="form-checkbox"
            />
            <span>Passwort erforderlich</span>
          </label>

          <button
            onClick={handleCreateInvite}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Erstelle..." : "QR-Code generieren"}
          </button>

          {inviteUrl && (
            <div className="mt-6 text-center space-y-4">
              <QRCode value={inviteUrl} />
              <p className="break-all text-sm bg-gray-100 p-2 rounded">{inviteUrl}</p>
              <button
                className="text-blue-600 underline"
                onClick={() => navigator.clipboard.writeText(inviteUrl)}
              >
                Link kopieren
              </button>
              <button
                className="block mt-2 text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => window.print()}
              >
                Drucken (A4)
              </button>
            </div>
          )}
        </div>

        {/* --- WHATSAPP/EMAIL LINK --- */}
        <div className="bg-white shadow rounded p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Einladungslink teilen</h2>

          <p className="text-sm text-gray-600 mb-4">
            Dieser Link funktioniert nur **einmal** und läuft nach dem ersten Aufruf ab.
          </p>

          <button
            onClick={handleCreateInvite}
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Erstelle..." : "Einladungslink erzeugen"}
          </button>

          {inviteUrl && (
            <div className="mt-6 text-center space-y-3">
              <p className="break-all text-sm bg-gray-100 p-2 rounded">{inviteUrl}</p>

              <div className="flex justify-center gap-4">
                {typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent) && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(inviteUrl)}`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    WhatsApp teilen
                  </a>
                )}
                <a
                  href={`mailto:?subject=Einladung zum Team&body=Hier ist dein Einladungslink: ${inviteUrl}`}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Per E-Mail teilen
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
