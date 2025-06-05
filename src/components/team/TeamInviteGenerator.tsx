// src/components/team/TeamInviteGenerator.tsx

import { useState } from "react";
import QRCode from "react-qr-code";
import { Mail } from "lucide-react";
import { isMobile } from "react-device-detect";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState("");
  const [qrSecureUrl, setQrSecureUrl] = useState("");
  const [loadingType, setLoadingType] = useState<
    "qr" | "secure" | "link-whatsapp" | "link-email" | null
  >(null);

  // Hilfsfunktion: Anfrage an /api/team/create-invite
  const createInvite = async (type: string, expiresInHours?: number) => {
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, expiresInHours }),
    });
    return await res.json();
  };

  // Option 1: "QR-Code ohne Passwort" (30 Tage = 720 Stunden)
  const handleQr = async () => {
    setLoadingType("qr");
    const data = await createInvite("qr_simple", 720);
    setQrUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  // Option 2: "QR-Code mit Passwort" (7 Tage = 168 Stunden)
  const handleSecureQr = async () => {
    setLoadingType("secure");
    const data = await createInvite("qr_protected", 168);
    setQrSecureUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  // Option 3: "Einmal-Link per WhatsApp / E-Mail"
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
    setLoadingType(null);

    if (mode === "whatsapp") {
      // Direkt-Weiterleitung zu WhatsApp
      window.location.href = `https://wa.me/?text=${encodedUrl}`;
    } else {
      // mailto:
      window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
    }
  };

  // Wrapper-Komponente für jede Option
  const Card = ({
    title,
    description,
    buttonArea,
    content,
  }: {
    title: string;
    description: string;
    buttonArea: JSX.Element;
    content?: JSX.Element | null;
  }) => (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {buttonArea}
      {content && <div className="mt-4 flex justify-center">{content}</div>}
    </section>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Einladungen verwalten
      </h1>

      {/* Option 1 */}
      <Card
        title="QR-Code ohne Passwort"
        description="30 Tage gültig, ideal für Aushänge oder interne Weitergabe."
        buttonArea={
          <button
            onClick={handleQr}
            className="w-full md:w-auto bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === "qr"}
          >
            {loadingType === "qr" ? "Erzeuge QR-Code …" : "QR-Code generieren"}
          </button>
        }
        content={
          qrUrl ? (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrUrl} level="H" size={128} />
            </div>
          ) : null
        }
      />

      {/* Option 2 */}
      <Card
        title="QR-Code mit Passwort"
        description="Passwort wechselt alle 24 Stunden, QR bleibt gültig (Passwort auf /team/security)."
        buttonArea={
          <button
            onClick={handleSecureQr}
            className="w-full md:w-auto bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === "secure"}
          >
            {loadingType === "secure"
              ? "Erzeuge geschützten Code …"
              : "QR-Code mit Passwort generieren"}
          </button>
        }
        content={
          qrSecureUrl ? (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={qrSecureUrl} level="H" size={128} />
            </div>
          ) : null
        }
      />

      {/* Option 3 */}
      <Card
        title="Einmal-Link per WhatsApp oder E-Mail"
        description="Nach dem ersten Klick verfällt der Link sofort. Direkt versenden an neue Teammitglieder."
        buttonArea={
          <div className="flex justify-center items-center gap-8">
            {/* WhatsApp-Icon (ein einziges SVG) */}
            <span
              onClick={() => generateAndSendLink("whatsapp")}
              className={`cursor-pointer ${
                loadingType === "link-whatsapp" ? "opacity-50" : "hover:opacity-80"
              }`}
              title="Per WhatsApp senden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-8 h-8 text-green-500"
                fill="currentColor"
              >
                <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32 103.3 32 4.3 130.9 .1 252.1c-.3 10.6.1 21.2 1.2 31.7L0 480l194.8-51.5c9.9 2.8 20.2 4.2 30.6 4.2 121.2 0 220.2-98.9 224.5-220.2 1.1-60.3-22.3-115.7-64.9-157.4zM224.6 426c-8.7 0-17.4-1.2-25.7-3.5l-18.3-5-115.3 30.5 30.8-112.3-5.9-19C84.2 290.3 72 256.8 72.7 222.3c1.2-100.4 83.2-182.2 183.6-182.2 48.6 0 94.2 18.9 128.7 53.2s53.3 80.1 52.1 128.7c-2.3 100.4-84.2 181.5-184.5 181.5zM294.6 290.7l-16.3-4.7c-2.2-.6-4.6-.8-6.9-.3l-10.4 1.7c-7.7 1.3-14.1-4.3-15.4-12l-1.6-7.6c-1.4-6.3 3.6-12.2 9.8-12.8l12.3-1.4c3.1-.4 6.2-1.4 8.8-3l8.5-6.4c4.9-3.7 3.3-11.4-2.9-12.5l-15.5-2.3c-2.2-.3-4.4-.2-6.5.3l-20.5 6.1c-6.1 1.8-13.1-1.4-15.1-7.3l-5.4-17.4c-2.1-6.7 3.5-13.3 10.6-12.7l23.6 1.9c5.4.4 10.8-2.1 14.2-6.5l10.9-15.1c3.5-4.9 10.7-4.9 14.2 0l10.3 14.3c3.2 4.4 8.1 6.9 13.3 6.5l21.2-1.6c7.2-.6 12.5 6.2 10.4 12.8l-6.9 18.4c-1.7 4.5-5.7 7.6-10.5 8.1l-9.5.8c-2.4.2-4.8.1-7.1-.4l-19-5.3c-6.3-1.8-13.3.4-16.9 5.2l-10 10.8c-3.9 4.1-4.5 10.2-1.4 15.1l9.3 14.1c3.4 5.2 2.7 12.1-1.7 16.2l-13.8 12.1c-3.6 3.2-8.2 4.6-12.9 3.8l-18.2-3.4c-6.1-1.1-10.4-6.7-9.6-12.8l2.2-18.7c.5-4.2-3.3-7.9-7.6-7.1l-16.4 3.6c-6.8 1.5-14.1-2.6-15.5-9.4l-4.1-18.9c-1.4-6.5 3.3-12.8 9.9-13.6l24.8-2.8c6.1-.7 11.9 2.4 15.2 7.9l9.3 15.3c3.8 6.2 11.9 8.5 18.1 4.8l14.2-8.5c6-3.6 13.6-2.2 18.3 3.3l11.3 11.7c4.6 4.8 4.9 12.1 .5 17.2l-11.6 12.9c-4.3 4.8-11 6.3-16.9 3.6z" />
              </svg>
            </span>

            {/* Mail-Icon (lucide-react) */}
            <span
              onClick={() => generateAndSendLink("email")}
              className={`cursor-pointer ${
                loadingType === "link-email" ? "opacity-50" : "hover:opacity-80"
              }`}
              title="Per E-Mail senden"
            >
              <Mail className="w-8 h-8 text-blue-500" />
            </span>
          </div>
        }
      />
    </div>
  );
}
