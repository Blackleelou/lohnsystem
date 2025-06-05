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
    setLinkUrl(data.url);
    setLoadingType(null);

    const encodedUrl = encodeURIComponent(data.url);
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
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => generateAndSendLink("whatsapp")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
            disabled={loadingType === "link-whatsapp"}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {loadingType === "link-whatsapp" ? "Lade…" : "Per WhatsApp senden"}
          </button>
          <button
            onClick={() => generateAndSendLink("email")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={loadingType === "link-email"}
          >
            <Mail className="w-5 h-5 mr-2" />
            {loadingType === "link-email" ? "Lade…" : "Per E-Mail senden"}
          </button>
        </div>
        {linkUrl && (
          <p className="mt-4 text-sm text-center break-all">{linkUrl}</p>
        )}
      </section>
    </div>
  );
}
