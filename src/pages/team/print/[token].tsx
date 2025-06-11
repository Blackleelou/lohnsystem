// pages/team/print/[token].tsx
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';
import Head from 'next/head';
import { useState } from 'react';

export default function PrintableQRPage() {
  const router = useRouter();
  const { token } = router.query;

  const [title, setTitle] = useState('Willkommen im Team!');
  const [customHeadline, setCustomHeadline] = useState('');
  const [customText, setCustomText] = useState('');

  if (!token || typeof token !== 'string') {
    return <p>Ungültiger QR-Code.</p>;
  }

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/team/join/${token}`;
  const finalTitle = title === 'custom' ? customHeadline : title;

  return (
    <>
      <Head>
        <title>Team-Einladung – QR-Code</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black space-y-6 print:space-y-4 print:p-0">
        {/* Ansicht nur sichtbar außerhalb des Drucks */}
        <div className="w-full max-w-md space-y-4 print:hidden">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Überschrift auswählen</span>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option>Willkommen im Team!</option>
              <option>Schön, dass du da bist!</option>
              <option>Beitreten & loslegen</option>
              <option>Scanne & sei dabei</option>
              <option value="custom">Eigene Überschrift</option>
            </select>
          </label>

          {title === 'custom' && (
            <input
              type="text"
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              placeholder="Eigene Überschrift"
              className="w-full border border-gray-300 rounded p-2"
            />
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Freitext (optional)</span>
            <textarea
              rows={2}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="z. B. Bitte bring dein Handy mit oder melde dich beim Empfang."
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
        </div>

        {/* Druckbereich */}
        <div className="border border-gray-300 rounded-lg p-8 text-center space-y-4 print:border-none print:p-0">
          {finalTitle && (
            <h1 className="text-2xl font-bold text-gray-800">{finalTitle}</h1>
          )}
          {customText && (
            <p className="text-gray-600 text-sm">{customText}</p>
          )}
          <QRCode value={joinUrl} size={192} />
        </div>
      </div>

            </div>

      {/* Nur sichtbar außerhalb von Druckansicht */}
      <div className="mt-6 print:hidden flex justify-center">
        <button
          onClick={() => window.print()}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded shadow"
        >
          Drucken
        </button>
      </div>
    </>
  );
}
