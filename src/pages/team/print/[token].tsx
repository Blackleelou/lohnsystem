// pages/team/print/[token].tsx

import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PrintableQRPage() {
  const router = useRouter();
  const { token } = router.query;

  const [teamName, setTeamName] = useState('deinem Team');
  const [headline, setHeadline] = useState('Willkommen bei');
  const [customText, setCustomText] = useState('');
  const [logo, setLogo] = useState<string | null>(null); // base64 oder URL

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/team/join/${token}`;

  // Teamnamen dynamisch abrufen (basiert auf Invite)
  useEffect(() => {
  if (!token || typeof token !== 'string') return;

  fetch(`/api/team/from-invite?token=${token}`)
    .then(res => res.json())
    .then(data => {
      if (data?.team?.name) {
        setTeamName(data.team.name);
      }

      if (data?.invitation) {
        if (data.invitation.printTitle) setHeadline(data.invitation.printTitle);
        if (data.invitation.printText) setCustomText(data.invitation.printText);
        if (data.invitation.printLogo) setLogo(data.invitation.printLogo);
      }
    });
}, [token]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const printPage = () => {
    window.print();
  };

  return (
    <>
      <Head>
        <title>Team-Einladung – Druckvorschau</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-white text-black px-6 py-8 print:p-0">
        {/* Vorschaubereich */}
        <div className="max-w-xl mx-auto w-full border border-gray-300 rounded-lg p-8 shadow print:shadow-none print:border-0 print:p-0 text-center">
          <h1 className="text-2xl font-bold mb-2">{headline} {teamName}</h1>

          {customText && (
            <p className="mb-6 text-sm text-gray-700 whitespace-pre-wrap">{customText}</p>
          )}

          {logo && (
            <div className="mb-6 flex justify-center">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain max-h-[100px]"
              />
            </div>
          )}

          {/* QR-Code – max. 25 % der Höhe (bei A4 ca. 210px) */}
          <div className="flex justify-center items-center my-6">
            <QRCode value={joinUrl} size={210} level="H" />
          </div>

          <p className="text-sm text-gray-600 print:hidden">
            Scanne den Code, um deinem Team beizutreten. <br />
            Gültigkeit hängt vom Einladungstyp ab.
          </p>
        </div>

        {/* Einstellungen & Buttons */}
        <div className="mt-8 print:hidden max-w-xl mx-auto text-center space-y-4">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="Überschrift (z. B. Willkommen bei)"
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Freitext (optional)"
              rows={3}
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
            >
              Zurück
            </button>
            <button
  onClick={async () => {
    if (!token || typeof token !== 'string') return;

    const res = await fetch('/api/team/update-invite-print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        title: headline,
        text: customText,
        logo,
      }),
    });

    if (res.ok) {
      alert('Entwurf gespeichert!');
    } else {
      const data = await res.json();
      alert(`Fehler beim Speichern: ${data.error || 'Unbekannter Fehler'}`);
    }
  }}
  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
>
  Speichern
</button>
          </div>
        </div>
      </div>
    </>
  );
}
