import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';
import Head from 'next/head';

export default function PrintableQRPage() {
  const router = useRouter();
  const { token } = router.query;

  if (!token || typeof token !== 'string') {
    return <p>Ungültiger QR-Code.</p>;
  }

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/team/join/${token}`;

  return (
    <>
      <Head>
        <title>Team-Einladung – QR-Code</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white text-black">
        {/* Überschrift */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Herzlich willkommen im Team!
        </h1>

        {/* QR-Code zentriert, max 25% der Höhe */}
        <div style={{ height: '25vh' }}>
          <QRCode value={joinUrl} level="H" style={{ height: '100%', width: '100%' }} />
        </div>

        {/* Hinweistext (nur sichtbar außerhalb Druck) */}
        <p className="mt-6 text-sm text-center text-gray-600 max-w-xs print:hidden">
          Diesen QR-Code bitte einscannen, um dem Team beizutreten.
        </p>
      </div>

      {/* Drucken-Button (nicht im Ausdruck sichtbar) */}
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
