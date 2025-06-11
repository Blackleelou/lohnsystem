import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function PrintableQrPreview({ token }: { token: string }) {
  const [title, setTitle] = useState('Willkommen im Team!');
  const [customText, setCustomText] = useState('');
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/join/${token}`;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 border border-gray-200">
      {/* Live-Vorschau */}
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {customText && <p className="text-sm text-gray-600">{customText}</p>}
        <QRCode value={url} size={160} />
      </div>

      {/* Eingabefelder */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Überschrift wählen</label>
          <select
            className="mt-1 block w-full rounded border-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option>Willkommen im Team!</option>
            <option>Schön, dass du da bist!</option>
            <option>Beitreten & loslegen</option>
            <option>Scanne & sei dabei</option>
            <option value="">Eigene Überschrift</option>
          </select>
        </div>

        {title === '' && (
          <input
            type="text"
            placeholder="Eigene Überschrift"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          />
        )}
      </div>
    </div>
  );
}
