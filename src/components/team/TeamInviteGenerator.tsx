import { useState } from "react";
import QRCode from "react-qr-code";
import { isMobile } from "react-device-detect";
import { Mail, MessageCircle } from "lucide-react";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState("");
  const [qrSecureUrl, setQrSecureUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loadingType, setLoadingType] = useState<"qr" | "secure" | "link-whatsapp" | "link-email" | null>(null);

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

  const generateAndSendLink = async (mode: "whatsapp" | "email") => {
  setLoadingType(mode === "whatsapp" ? "link-whatsapp" : "link-email");
  const res = await fetch("/api/team/create-invite", {
    method: "POST",
    body: JSON.stringify({ type: "onetime" }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const url = data.invitation?.joinUrl;

  if (!url) {
    alert("Fehler: Kein Link generiert.");
    setLoadingType(null);
    return;
  }

  setLinkUrl(url);
  setLoadingType(null);

  const encodedUrl = encodeURIComponent(url);
  if (mode === "whatsapp") {
    window.open(`https://wa.me/?text=${encodedUrl}`, "_blank");
  } else {
    window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
  }
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
  <div className="flex items-center gap-6">
    <span className="text-sm text-gray-600">Link versenden über:</span>
    <button
      onClick={() => generateAndSendLink("whatsapp")}
      title="Per WhatsApp senden"
      className="hover:opacity-80"
      disabled={loadingType === "link-whatsapp"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 text-green-500">
        <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32 103.3 32 4.3 130.9.1 252.1c-.3 10.6.1 21.2 1.2 31.7L0 480l194.8-51.5c9.9 2.8 20.2 4.2 30.6 4.2 121.2 0 220.2-98.9 224.5-220.2 1.1-60.3-22.3-115.7-64.9-157.4zM224.6 426c-8.7 0-17.4-1.2-25.7-3.5l-18.3-5-115.3 30.5 30.8-112.3-5.9-19C84.2 290.3 72 256.8 72.7 222.3c1.2-100.4 83.2-182.2 183.6-182.2 48.6 0 94.2 18.9 128.7 53.2s53.3 80.1 52.1 128.7c-2.3 100.4-84.2 181.5-184.5 181.5z"/>
      </svg>
    </button>
    <button
      onClick={() => generateAndSendLink("email")}
      title="Per E-Mail senden"
      className="hover:opacity-80"
      disabled={loadingType === "link-email"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 text-blue-500">
        <path d="M502.3 190.8 327.4 338c-18.8 15.7-44.7 24-71.4 24s-52.6-8.3-71.4-24L9.7 190.8C3.8 185.5 0 177.9 0 169.7c0-17.7 14.3-32 32-32h448c17.7 0 32 14.3 32 32 0 8.2-3.8 15.8-9.7 20.1z"/>
      </svg>
    </button>
  </div>
  {linkUrl && (
    <p className="mt-4 text-sm text-center break-all">{linkUrl}</p>
  )}
</section>
    </div>
  );
}
