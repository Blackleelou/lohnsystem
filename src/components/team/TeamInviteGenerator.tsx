import { useState } from "react";
import QRCode from "react-qr-code";
import Layout from "@/components/common/Layout";

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState("");
  const [qrSecureUrl, setQrSecureUrl] = useState("");
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
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      {children}
    </section>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Teammitglieder einladen</h1>

        <Card
          title="Option 1: QR-Code ohne Passwort"
          description="Dieser QR-Code ist 30 Tage gültig. Ideal für Aushänge oder interne Weitergabe."
        >
          <button
            onClick={handleQr}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loadingType === "qr"}
          >
            {loadingType === "qr" ? "Erzeuge QR-Code…" : "QR-Code generieren"}
          </button>
          {qrUrl && (
            <div className="mt-4 flex justify-center">
              <QRCode value={qrUrl} />
            </div>
          )}
        </Card>

        <Card
          title="Option 2: QR-Code mit Passwort"
          description="Der QR-Code bleibt dauerhaft gültig, das Passwort wechselt automatisch alle 24 Stunden."
        >
          <button
            onClick={handleSecureQr}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loadingType === "secure"}
          >
            {loadingType === "secure" ? "Erzeuge geschützten Code…" : "QR-Code mit Passwort generieren"}
          </button>
          {qrSecureUrl && (
            <div className="mt-4 flex justify-center">
              <QRCode value={qrSecureUrl} />
            </div>
          )}
        </Card>

        <Card
          title="Option 3: Einmal-Link per E-Mail oder WhatsApp"
          description="Dieser Link kann nur einmal geöffnet werden – perfekt für persönliche Einladungen."
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Versenden über:</span>
            <button
              onClick={() => generateAndSendLink("whatsapp")}
              title="Per WhatsApp senden"
              className="hover:opacity-80 disabled:opacity-40"
              disabled={loadingType === "link-whatsapp"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339.3 55.6 283.9 32 224.6 32 103.3 32 4.3 130.9.1 252.1c-.3 10.6.1 21.2 1.2 31.7L0 480l194.8-51.5c9.9 2.8 20.2 4.2 30.6 4.2 121.2 0 220.2-98.9 224.5-220.2 1.1-60.3-22.3-115.7-64.9-157.4z" />
              </svg>
            </button>
            <button
              onClick={() => generateAndSendLink("email")}
              title="Per E-Mail senden"
              className="hover:opacity-80 disabled:opacity-40"
              disabled={loadingType === "link-email"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 512 512">
                <path d="M502.3 190.8 327.4 338c-18.8 15.7-44.7 24-71.4 24s-52.6-8.3-71.4-24L9.7 190.8C3.8 185.5 0 177.9 0 169.7c0-17.7 14.3-32 32-32h448c17.7 0 32 14.3 32 32 0 8.2-3.8 15.8-9.7 20.1z" />
              </svg>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
