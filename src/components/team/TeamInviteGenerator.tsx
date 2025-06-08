// src/components/team/TeamInviteGenerator.tsx
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState('');
  const [qrSecureUrl, setQrSecureUrl] = useState('');
  const [lastLink, setLastLink] = useState(''); // für Kopierfunktion
  const [loadingType, setLoadingType] = useState<
    'qr' | 'secure' | 'link-whatsapp' | 'link-email' | 'link-copy' | null
  >(null);

  const createInvite = async (type: string, expiresInHours?: number) => {
    const res = await fetch('/api/team/create-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, expiresInHours }),
    });
    return await res.json();
  };

  const handleQr = async () => {
    setLoadingType('qr');
    const data = await createInvite('qr_simple', 720);
    const url = data.invitation?.joinUrl || '';
    setQrUrl(url);
    setLastLink(url);
    setLoadingType(null);
  };

  const handleSecureQr = async () => {
    setLoadingType('secure');
    const data = await createInvite('qr_protected', 168);
    const url = data.invitation?.joinUrl || '';
    setQrSecureUrl(url);
    setLastLink(url);
    setLoadingType(null);
  };

  const generateAndSendLink = async (mode: 'whatsapp' | 'email') => {
    setLoadingType(mode === 'whatsapp' ? 'link-whatsapp' : 'link-email');
    const data = await createInvite('single_use');
    const url = data.invitation?.joinUrl;

    if (!url) {
      toast.error('Fehler: Kein Link generiert.');
      setLoadingType(null);
      return;
    }

    const encodedUrl = encodeURIComponent(`🎉 Team-Einladung: ${url}`);
    setLastLink(url);
    setLoadingType(null);

    if (mode === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodedUrl}`;
      window.open(whatsappUrl, '_blank');
    } else {
      if (!isMobile) {
        window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
        setTimeout(() => {
          toast('Es scheint kein E-Mail-Programm eingerichtet zu sein. Link wurde bereitgestellt.');
        }, 1500);
      } else {
        window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
      }
    }
  };

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
      <h1 className="text-2xl font-bold text-center text-gray-800">Einladungen verwalten</h1>

      {/* Option 1 */}
      <Card
        title="QR-Code ohne Passwort"
        description="30 Tage gültig, ideal für Aushänge oder interne Weitergabe."
        buttonArea={
          <button
            onClick={handleQr}
            className="w-full md:w-auto bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === 'qr'}
          >
            {loadingType === 'qr' ? 'Erzeuge QR-Code …' : 'QR-Code generieren'}
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
        description="Passwort wechselt alle 24 Stunden, QR bleibt gültig. Passwort auf /team/security."
        buttonArea={
          <button
            onClick={handleSecureQr}
            className="w-full md:w-auto bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
            disabled={loadingType === 'secure'}
          >
            {loadingType === 'secure'
              ? 'Erzeuge geschützten Code …'
              : 'QR-Code mit Passwort generieren'}
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
            {/* WhatsApp */}
            <span
              onClick={() => generateAndSendLink('whatsapp')}
              className={`cursor-pointer ${
                loadingType === 'link-whatsapp' ? 'opacity-50' : 'hover:opacity-80'
              }`}
              title="Per WhatsApp senden"
            >
              <FaWhatsapp className="w-8 h-8 text-green-500" />
            </span>

            {/* E-Mail */}
            <span
              onClick={() => generateAndSendLink('email')}
              className={`cursor-pointer ${
                loadingType === 'link-email' ? 'opacity-50' : 'hover:opacity-80'
              }`}
              title="Per E-Mail senden"
            >
              <Mail className="w-8 h-8 text-blue-500" />
            </span>

            {/* Link kopieren Icon (erzeugt neuen Token) */}
            {!isMobile && (
              <span
                onClick={async () => {
                  setLoadingType('link-copy');
                  try {
                    const data = await createInvite('single_use');
                    const url = data.invitation?.joinUrl;

                    if (!url) {
                      toast.error('Fehler: Kein Link generiert.');
                      return;
                    }

                    await navigator.clipboard.writeText(url);
                    setLastLink(url);
                    toast.success('Einladungslink wurde in die Zwischenablage kopiert!');
                  } catch (err) {
                    toast.error('Konnte keinen Link generieren.');
                  } finally {
                    setLoadingType(null);
                  }
                }}
                className={`cursor-pointer ${loadingType === 'link-copy' ? 'opacity-50' : 'hover:opacity-80'}`}
                title="Link kopieren"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16h8m-4-4h4m-4-4h4M7 8h.01M7 16h.01M3 4a1 1 0 011-1h13.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                  />
                </svg>
              </span>
            )}
          </div>
        }
      />
    </div>
  );
}
