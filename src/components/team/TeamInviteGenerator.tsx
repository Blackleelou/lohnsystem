// src/components/team/TeamInviteGenerator.tsx

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { FaWhatsapp, FaQrcode } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';

export default function TeamInviteGenerator() {
  const [qrUrl, setQrUrl] = useState('');
  const [qrSecureUrl, setQrSecureUrl] = useState('');
  const [lastLink, setLastLink] = useState('');
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
      window.open(`https://wa.me/?text=${encodedUrl}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=Team Einladung&body=${encodedUrl}`;
      if (!isMobile) {
        setTimeout(() => {
          toast('Es scheint kein E-Mail-Programm eingerichtet zu sein.');
        }, 1500);
      }
    }
  };

  const Card = ({
    title,
    description,
    action,
    content,
  }: {
    title: string;
    description: string | JSX.Element;
    action: JSX.Element;
    content?: JSX.Element | null;
  }) => (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div>{action}</div>
      {content && <div className="mt-4 flex justify-center">{content}</div>}
    </section>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-center text-gray-800">Einladungen verwalten</h1>

      {/* Option 1: QR ohne Passwort */}
      <Card
        title="QR-Code ohne Passwort"
        description="30 Tage gültig, ideal für Aushänge oder interne Weitergabe."
        action={
          <button
            onClick={handleQr}
            className="inline-flex items-center gap-2 text-violet-700 hover:underline text-sm"
            disabled={loadingType === 'qr'}
          >
            {loadingType === 'qr' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaQrcode />}
            QR-Code generieren
          </button>
        }
        content={
          qrUrl ? (
            <QRCode value={qrUrl} level="H" size={128} />
          ) : null
        }
      />

      {/* Option 2: QR mit Passwort */}
      <Card
        title="QR-Code mit Passwort"
        description={
          <span className="flex items-center gap-1 text-gray-500">
            Passwort wechselt täglich. 
            <Lock className="w-4 h-4 text-gray-400" />
            <a href="/team/security" className="text-violet-600 hover:underline ml-1">Anzeigen</a>
          </span>
        }
        action={
          <button
            onClick={handleSecureQr}
            className="inline-flex items-center gap-2 text-violet-700 hover:underline text-sm"
            disabled={loadingType === 'secure'}
          >
            {loadingType === 'secure' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaQrcode />}
            QR-Code mit Passwort generieren
          </button>
        }
        content={
          qrSecureUrl ? (
            <QRCode value={qrSecureUrl} level="H" size={128} />
          ) : null
        }
      />

      {/* Option 3: Einmal-Link */}
      <Card
        title="Einmal-Link per WhatsApp oder E-Mail"
        description="Nach erstem Klick verfällt der Link. Direkt versenden an neue Teammitglieder."
        action={
          <div className="flex justify-start items-center gap-6 text-gray-600">
            {/* WhatsApp */}
            <button
              onClick={() => generateAndSendLink('whatsapp')}
              disabled={loadingType === 'link-whatsapp'}
              title="Per WhatsApp senden"
              className="hover:text-green-600"
            >
              <FaWhatsapp className="w-6 h-6" />
            </button>

            {/* E-Mail */}
            <button
              onClick={() => generateAndSendLink('email')}
              disabled={loadingType === 'link-email'}
              title="Per E-Mail senden"
              className="hover:text-blue-600"
            >
              <Mail className="w-6 h-6" />
            </button>

            {/* Link kopieren */}
            {!isMobile && (
              <button
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
                    toast.success('Einladungslink kopiert!');
                  } catch (err) {
                    toast.error('Konnte keinen Link generieren.');
                  } finally {
                    setLoadingType(null);
                  }
                }}
                disabled={loadingType === 'link-copy'}
                title="Link kopieren"
                className="hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16h8m-4-4h4m-4-4h4M7 8h.01M7 16h.01M3 4a1 1 0 011-1h13.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                  />
                </svg>
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
