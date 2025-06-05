import { useState } from "react";
import QRCode from "react-qr-code";

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

    const encodedUrl = encodeURIComponent(`🎉 Einladung zum Team: ${url}`);
    setLinkUrl(url);
    setLoadingType(null);

    if (mode === "whatsapp") {
      window.location.href = `https://wa.me/?text=${encodedUrl}`;
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
    content?: JSX.Element | null;
  }) => (
    <section className="bg-white rounded-xl border border-gray-200 shadow p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {button}
      {content && <div className="mt-4">{content}</div>}
    </section>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 bg-white text-gray-800">
      <h1 className="text-2xl font-bold text-center mb-4">Teameinladungen verwalten</h1>

      <Card
        title="Option 1: QR-Code ohne Passwort"
        description="Dieser QR-Code ist 30 Tage gültig. Ideal für allgemeine Aushänge oder interne Weitergabe."
        button={
          <button
            onClick={handleQr}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === "qr"}
          >
            {loadingType === "qr" ? "Erzeuge QR-Code…" : "QR-Code generieren"}
          </button>
        }
        content={
          qrUrl ? (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrUrl} />
            </div>
          ) : null
        }
      />

      <Card
        title="Option 2: QR-Code mit Passwort"
        description="Dieser QR-Code ist durch ein wechselndes Passwort geschützt (sichtbar unter /team/security). QR bleibt dauerhaft gültig."
        button={
          <button
            onClick={handleSecureQr}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === "secure"}
          >
            {loadingType === "secure" ? "Erzeuge geschützten Code…" : "QR-Code mit Passwort generieren"}
          </button>
        }
        content={
          qrSecureUrl ? (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrSecureUrl} />
            </div>
          ) : null
        }
      />

      <Card
        title="Option 3: Einmal-Link per E-Mail oder WhatsApp"
        description="Dieser Link ist nach dem ersten Klick ungültig. Ideal zum direkten Versand an neue Teammitglieder."
        button={
          <div className="flex gap-6 items-center">
            <span className="text-sm text-gray-600">Versenden via:</span>
            <button
              onClick={() => generateAndSendLink("whatsapp")}
              className="hover:opacity-80"
              disabled={loadingType === "link-whatsapp"}
              title="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32..." />
              </svg>
            </button>
            <button
              onClick={() => generateAndSendLink("email")}
              className="hover:opacity-80"
              disabled={loadingType === "link-email"}
              title="E-Mail"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 512 512">
                <path d="M502.3 190.8 327.4 338..." />
              </svg>
            </button>
          </div>
        }
      />
    </div>
  );
}
