import { useState } from "react";
import QRCode from "react-qr-code";
import { isMobile } from "react-device-detect";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState("");
  const [qrSecureUrl, setQrSecureUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loadingType, setLoadingType] = useState<"qr" | "secure" | "link" | null>(null);

  const handleQr = async () => {
    setLoadingType("qr");
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      body: JSON.stringify({ type: "qr", expiresInHours: 720 }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setQrUrl(data.url);
    setLoadingType(null);
  };

  const handleSecureQr = async () => {
    setLoadingType("secure");
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      body: JSON.stringify({ type: "secure", expiresInHours: 168 }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setQrSecureUrl(data.url);
    setLoadingType(null);
  };

  const handleLink = async () => {
    setLoadingType("link");
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      body: JSON.stringify({ type: "onetime" }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLinkUrl(data.url);
    setLoadingType(null);

    setTimeout(() => {
      if (isMobile && data.url) {
        window.open(`https://wa.me/?text=${encodeURIComponent(data.url)}`, "_blank");
      } else {
        window.location.href = `mailto:?subject=Team Einladung&body=${encodeURIComponent(data.url)}`;
      }
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 text-gray-800">
      {/* Option 1 */}
      <section className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Option 1: QR-Code ohne Passwort</h2>
        <p className="text-sm text-gray-500 mb-4">
          Dieser QR-Code ist 30 Tage gültig. Ideal für allgemeine Aushänge oder interne Nutzung.
        </p>
        <button
          onClick={handleQr}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          disabled={loadingType === "qr"}
        >
          {loadingType === "qr" ? "Erzeuge QR-Code…" : "QR-Code generieren"}
        </button>
        {qrUrl && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <QRCode value={qrUrl} />
            <code className="text-sm text-center break-all">{qrUrl}</code>
          </div>
        )}
      </section>

      {/* Option 2 */}
      <section className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Option 2: QR-Code mit Passwort</h2>
        <p className="text-sm text-gray-500 mb-4">
          Dieser Code ist durch ein Passwort geschützt (sichtbar auf der Seite <code>/team/security</code>). Das Passwort wechselt alle 24h automatisch, der QR bleibt gültig.
        </p>
        <button
          onClick={handleSecureQr}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          disabled={loadingType === "secure"}
        >
          {loadingType === "secure" ? "Erzeuge geschützten Code…" : "QR-Code mit Passwort generieren"}
        </button>
        {qrSecureUrl && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <QRCode value={qrSecureUrl} />
            <code className="text-sm text-center break-all">{qrSecureUrl}</code>
          </div>
        )}
      </section>

      {/* Option 3 */}
      <section className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Option 3: Einmal-Link per E-Mail oder WhatsApp</h2>
        <p className="text-sm text-gray-500 mb-4">
          Dieser Link ist nach dem ersten Klick ungültig. Ideal zum direkten Versand an neue Teammitglieder.
        </p>
        <button
          onClick={handleLink}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loadingType === "link"}
        >
          {loadingType === "link" ? "Erzeuge Link…" : isMobile ? "Per WhatsApp/E-Mail senden" : "Per E-Mail senden"}
        </button>
        {linkUrl && (
          <p className="mt-4 text-sm text-center break-all">{linkUrl}</p>
        )}
      </section>
    </div>
  );
}
