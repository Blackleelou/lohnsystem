// pages/team/print/[token].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Head from 'next/head';

const DEFAULT_TITLE_OPTIONS = [
  'Willkommen im Team!',
  'Du wurdest eingeladen 🥳',
  'Jetzt dem Team beitreten!',
  'Lust auf Teamwork?'
];

export default function PrintableQRPage() {
  const router = useRouter();
  const { token } = router.query;

  const [title, setTitle] = useState(DEFAULT_TITLE_OPTIONS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const joinUrl = typeof token === 'string'
    ? `${process.env.NEXT_PUBLIC_APP_URL || ''}/team/join/${token}`
    : '';

  useEffect(() => {
    if (!token || typeof token !== 'string') return;
    document.title = 'Team-Einladung – QR-Code';
  }, [token]);

  return (
    <>
      <Head>
        <title>Team-Einladung – QR-Code</title>
      </Head>

      {/* Editor (nicht sichtbar beim Druck) */}
      <div className="print:hidden max-w-2xl mx-auto py-6 px-4 bg-white shadow rounded mt-6 mb-12 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Drucklayout anpassen</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Überschrift wählen:</label>
        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          {DEFAULT_TITLE_OPTIONS.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
          <option value="custom">Eigene Überschrift eingeben …</option>
        </select>

        {title === 'custom' && (
          <input
            type="text"
            placeholder="Eigene Überschrift"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Infotext (optional):</label>
        <textarea
          rows={3}
          placeholder="Z. B. Scan mich oder Willkommen bei Luna Logistics!"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview(!showPreview)}
              className="mr-2"
            />
            Live-Vorschau anzeigen
          </label>
        </div>
      </div>

      {/* Druckansicht */}
      {showPreview && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 print:p-0 bg-white text-black">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {title === 'custom' ? customTitle : title}
          </h1>

          {joinUrl && (
            <div style={{ maxWidth: '25%', minWidth: 128 }}>
              <QRCode value={joinUrl} level="H" className="w-full h-auto" />
            </div>
          )}

          {customText && (
            <p className="mt-6 text-center text-gray-600 max-w-md whitespace-pre-line">
              {customText}
            </p>
          )}
        </div>
      )}
    </>
  );
}
