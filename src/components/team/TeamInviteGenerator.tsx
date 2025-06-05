import { useState } from "react";
import QRCode from "react-qr-code";
import { isMobile } from "react-device-detect";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState("");
  const [qrSecureUrl, setQrSecureUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loadingType, setLoadingType] = useState<"qr" | "secure" | "link-whatsapp" | "link-email" | null>(null);

  const createInvite = async (type: string, expiresInHours?: number) => {
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, expiresInHours }),
    });
    return await res.json();
  };

  const handleQr = async () => {
    setLoadingType("qr");
    const data = await createInvite("qr_simple", 720);
    setQrUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  const handleSecureQr = async () => {
    setLoadingType("secure");
    const data = await createInvite("qr_protected", 168);
    setQrSecureUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  const generateAndSendLink = async (mode: "whatsapp" | "email") => {
    setLoadingType(mode === "whatsapp" ? "link-whatsapp" : "link-email");
    const data = await createInvite("single_use");
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

  const Card = ({
    title,
    description,
    button,
    content,
  }: {
    title: string;
    description: string;
    button: JSX.Element;
    content?: JSX.Element;
  }) => (
    <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {button}
      {content && <div className="mt-4">{content}</div>}
    </section>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-gray-800">
      {/* Option 1 */}
      <Card
        title="Option 1: QR-Code ohne Passwort"
        description="Dieser QR-Code ist 30 Tage gültig. Ideal für allgemeine Aushänge oder interne Nutzung."
        button={
          <button
            onClick={handleQr}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            disabled={loadingType === "qr"}
          >
            {loadingType === "qr" ? "Erzeuge QR-Code…" : "QR-Code generieren"}
          </button>
        }
        content={
          qrUrl && (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrUrl} />
            </div>
          )
        }
      />

      {/* Option 2 */}
      <Card
        title="Option 2: QR-Code mit Passwort"
        description="Dieser Code ist durch ein Passwort geschützt (sichtbar unter /team/security). Das Passwort wechselt alle 24h automatisch, der QR bleibt gültig."
        button={
          <button
            onClick={handleSecureQr}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            disabled={loadingType === "secure"}
          >
            {loadingType === "secure" ? "Erzeuge geschützten Code…" : "QR-Code mit Passwort generieren"}
          </button>
        }
        content={
          qrSecureUrl && (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrSecureUrl} />
            </div>
          )
        }
      />

      {/* Option 3 */}
      <Card
        title="Option 3: Einmal-Link per E-Mail oder WhatsApp"
        description="Dieser Link ist nach dem ersten Klick ungültig. Ideal zum direkten Versand an neue Teammitglieder."
        button={
          <div className="flex gap-6 items-center">
            <span className="text-sm text-gray-600">Link versenden über:</span>
            <button
              onClick={() => generateAndSendLink("whatsapp")}
              title="Per WhatsApp senden"
              className="hover:opacity-80"
              disabled={loadingType === "link-whatsapp"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32 103.3 32 4.3 130.9.1 252.1c-.3 10.6.1 21.2 1.2 31.7L0 480l194.8-51.5c9.9 2.8 20.2 4.2 30.6 4.2 121.2 0 220.2-98.9 224.5-220.2 1.1-60.3-22.3-115.7-64.9-157.4z" />
              </svg>
            </button>
            <button
              onClick={() => generateAndSendLink("email")}
              title="Per E-Mail senden"
              className="hover:opacity-80"
              disabled={loadingType === "link-email"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 512 512">
                <path d="M502.3 190.8 327.4 338c-18.8 15.7-44.7 24-71.4 24s-52.6-8.3-71.4-24L9.7 190.8C3.8 185.5 0 177.9 0 169.7c0-17.7 14.3-32 32-32h448c17.7 0 32 14.3 32 32 0 8.2-3.8 15.8-9.7 20.1z" />
              </svg>
            </button>
          </div>
        }
      />
    </div>
  );
}
