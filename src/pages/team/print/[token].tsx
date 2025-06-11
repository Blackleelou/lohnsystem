// pages/team/print/[token].tsx
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
      <div className="flex flex-col items-center justify-center min-h-screen p-8 print:p-0 bg-white text-black">
        <h1 className="text-xl font-semibold mb-4 print:hidden">QR-Code zum Teambeitritt</h1>
        <QRCode value={joinUrl} level="H" size={256} />
        <p className="mt-4 text-sm text-center text-gray-600 max-w-xs print:hidden">
          Diesen QR-Code können neue Teammitglieder einscannen, um dem Team beizutreten. Die Einladung ist ggf. zeitlich begrenzt.
        </p>
      </div>
    </>
  );
}
