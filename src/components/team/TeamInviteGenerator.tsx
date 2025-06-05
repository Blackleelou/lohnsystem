// src/components/team/TeamInviteGenerator.tsx

import { useState } from "react";
import QRCode from "react-qr-code";
import { isMobile } from "react-device-detect";
import { Mail } from "lucide-react";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrSecureUrl, setQrSecureUrl] = useState<string>("");
  const [loadingType, setLoadingType] = useState<"qr" | "secure" | "link-whatsapp" | "link-email" | null>(null);

  // Helper: Anfrage an die API
  const createInvite = async (type: string, expiresInHours?: number) => {
    const res = await fetch("/api/team/create-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, expiresInHours }),
    });
    return await res.json();
  };

  // Option 1: einfacher QR-Code
  const handleQr = async () => {
    setLoadingType("qr");
    try {
      const data = await createInvite("qr_simple", 720);
      setQrUrl(data.invitation?.joinUrl || "");
    } catch (e) {
      console.error(e);
      alert("Fehler beim Erzeugen des QR-Codes.");
    } finally {
      setLoadingType(null);
    }
  };

  // Option 2: QR-Code mit Passwort
  const handleSecureQr = async () => {
    setLoadingType("secure");
    try {
      const data = await createInvite("qr_protected", 168);
      setQrSecureUrl(data.invitation?.joinUrl || "");
    } catch (e) {
      console.error(e);
      alert("Fehler beim Erzeugen des geschützten QR-Codes.");
    } finally {
      setLoadingType(null);
    }
  };

  // Option 3: Einmal-Link per WhatsApp oder E-Mail
  const generateAndSendLink = async (mode: "whatsapp" | "email") => {
    setLoadingType(mode === "whatsapp" ? "link-whatsapp" : "link-email");
    try {
      const data = await createInvite("single_use");
      const url = data.invitation?.joinUrl;
      if (!url) {
        alert("Fehler: Kein Link generiert.");
        setLoadingType(null);
        return;
      }
      const encodedText = encodeURIComponent(`🎉 Einladung zum Team: ${url}`);
      if (mode === "whatsapp") {
        // Auf Mobilgeräten klappt das via "location.href"
        window.location.href = `https://wa.me/?text=${encodedText}`;
      } else {
        window.location.href = `mailto:?subject=Team Einladung&body=${encodedText}`;
      }
    } catch (e) {
      console.error(e);
      alert("Fehler beim Generieren des Links.");
    } finally {
      setLoadingType(null);
    }
  };

  // Karten-Komponente
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
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {button}
      {content && <div className="mt-4 flex justify-center">{content}</div>}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Überschrift */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Teameinladungen verwalten</h1>
          <p className="text-sm text-gray-600">
            Erstelle QR-Codes oder Einmal-Links, um neue Mitglieder einfach einzuladen.
          </p>
        </div>

        {/* Option 1 */}
        <Card
          title="Option 1: QR-Code ohne Passwort"
          description="Dieser QR-Code ist 30 Tage gültig. Ideal für Aushänge oder interne Weitergabe."
          button={
            <button
              onClick={handleQr}
              disabled={loadingType === "qr"}
              className={`w-full md:w-auto bg-indigo-600 text-white px-5 py-2 rounded-md font-medium transition 
                ${loadingType === "qr" ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loadingType === "qr" ? "Erzeuge QR-Code…" : "QR-Code generieren"}
            </button>
          }
          content={
            qrUrl ? (
              <QRCode value={qrUrl} size={128} className="bg-white p-2 rounded-md" />
            ) : null
          }
        />

        {/* Option 2 */}
        <Card
          title="Option 2: QR-Code mit Passwort"
          description="Geschützter QR-Code mit wechselndem Passwort (24 h). Passwort unter /team/security einsehbar."
          button={
            <button
              onClick={handleSecureQr}
              disabled={loadingType === "secure"}
              className={`w-full md:w-auto bg-indigo-600 text-white px-5 py-2 rounded-md font-medium transition 
                ${loadingType === "secure" ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loadingType === "secure" ? "Erzeuge geschützten Code…" : "QR-Code mit Passwort generieren"}
            </button>
          }
          content={
            qrSecureUrl ? (
              <QRCode value={qrSecureUrl} size={128} className="bg-white p-2 rounded-md" />
            ) : null
          }
        />

        {/* Option 3 */}
        <Card
          title="Option 3: Einmal-Link per E-Mail oder WhatsApp"
          description="Dieser Link ist nach dem ersten Klick ungültig. Ideal zum sofortigen Versand an neue Teammitglieder."
          button={
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => generateAndSendLink("whatsapp")}
                disabled={loadingType === "link-whatsapp"}
                title="Per WhatsApp senden"
                className={`flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md transition 
                  ${loadingType === "link-whatsapp" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
              >
                {/* WhatsApp-Icon (typisch WhatsApp-Grün) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32 103.3 32 4.3 130.9.1 252.1c-.3 10.6.1 21.2 1.2 31.7L0 480l194.8-51.5c9.9 2.8 20.2 4.2 30.6 4.2 121.2 0 220.2-98.9 224.5-220.2 1.1-60.3-22.3-115.7-64.9-157.4zM224.6 426c-8.7 0-17.4-1.2-25.7-3.5l-18.3-5-115.3 30.5 30.8-112.3-5.9-19C84.2 290.3 72 256.8 72.7 222.3c1.2-100.4 83.2-182.2 183.6-182.2 48.6 0 94.2 18.9 128.7 53.2s53.3 80.1 52.1 128.7c-2.3 100.4-84.2 181.5-184.5 181.5z" />
                </svg>
                <span className="text-sm font-medium">
                  {loadingType === "link-whatsapp" ? "Lade…" : "Per WhatsApp senden"}
                </span>
              </button>

              <button
                onClick={() => generateAndSendLink("email")}
                disabled={loadingType === "link-email"}
                title="Per E-Mail senden"
                className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md transition 
                  ${loadingType === "link-email" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                <Mail className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">
                  {loadingType === "link-email" ? "Lade…" : "Per E-Mail senden"}
                </span>
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
