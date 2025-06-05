// src/components/team/TeamInviteGenerator.tsx

import { useState } from "react";
import QRCode from "react-qr-code";
import { Mail, BrandWhatsapp } from "lucide-react"; // ← Hier importieren wir BrandWhatsapp
import { isMobile } from "react-device-detect";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrSecureUrl, setQrSecureUrl] = useState<string>("");
  const [loadingType, setLoadingType] = useState<"qr" | "secure" | "link-whatsapp" | "link-email" | null>(null);

  const createInvite = async (type: string, expiresInHours?: number) => {
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, expiresInHours }),
    });
    return await res.json();
  };

  // Option 1: QR-Code ohne Passwort (30 Tage)
  const handleQr = async () => {
    setLoadingType("qr");
    const data = await createInvite("qr_simple", 720);
    setQrUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  // Option 2: QR-Code mit Passwort (7 Tage)
  const handleSecureQr = async () => {
    setLoadingType("secure");
    const data = await createInvite("qr_protected", 168);
    setQrSecureUrl(data.invitation?.joinUrl || "");
    setLoadingType(null);
  };

  // Option 3: Einmal-Link per WhatsApp / E-Mail
  const generateAndSendLink = async (mode: "whatsapp" | "email") => {
    setLoadingType(mode === "whatsapp" ? "link-whatsapp" : "link-email");
    const data = await createInvite("single_use");
    const url = data.invitation?.joinUrl;
    if (!url) {
      alert("Fehler: Kein Link generiert.");
      setLoadingType(null);
      return;
    }
    const encodedUrl = encodeURIComponent(`🎉 Team-Einladung: ${url}`);
    setLoadingType(null);

    if (mode === "whatsapp") {
      // Auf dem Handy reicht window.location.href; auf Desktop öffnet es WhatsApp Web
      window.location.href = `https://wa.me/?text=${encodedUrl}`;
    } else {
      window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
    }
  };

  // Wiederverwendbare Card-Komponente
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
        description="Passwort wechselt alle 24 Stunden, der QR bleibt gültig. Passwort auf /team/security."
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
        description="Nach erstem Klick verfällt der Link. Direkt versenden an neue Teammitglieder."
        buttonArea={
          <div className="flex justify-center items-center gap-8">
            {/* WhatsApp-Icon (Lucide: BrandWhatsapp) */}
            <span
              onClick={() => generateAndSendLink("whatsapp")}
              className={`cursor-pointer ${
                loadingType === "link-whatsapp" ? "opacity-50" : "hover:opacity-80"
              }`}
              title="Per WhatsApp senden"
            >
              <BrandWhatsapp className="w-8 h-8 text-green-500" />
            </span>

            {/* E-Mail-Icon (Lucide: Mail) */}
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
