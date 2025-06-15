import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialisiere Default-Werte
  let db: 'ok' | 'warn' | 'error' = 'warn';
  let dbSize: string | null = null;
  let dbSizeRaw: number | null = null;
  let dbSizePercent: number | null = null;

  let mail: 'ok' | 'warn' | 'error' = 'warn';
  let dbError: string | null = null;
  let mailError: string | null = null;

  // ✅ Teste Datenbankverbindung
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.user.findFirst();

    const result: any = await prisma.$queryRawUnsafe(`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) AS size_pretty,
        pg_database_size(current_database()) AS size_bytes;
    `);

    dbSize = result?.[0]?.size_pretty || null;
    dbSizeRaw = result?.[0]?.size_bytes || null;

    if (dbSizeRaw !== null) {
      dbSizePercent = Math.round((dbSizeRaw / 10_000_000_000) * 100);
    }

    db = 'ok';
  } catch (e: any) {
    db = 'error';
    dbError = e.message || 'Unbekannter Fehler';
    console.error('[DB ERROR]', e);
  }

  // ✅ Teste Mail-Transport
  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Health-Check" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: 'Health Check',
      text: 'Test',
    });

    mail = 'ok';
  } catch (e: any) {
    mail = 'error';
    mailError = e.message || 'Unbekannter Fehler';
    console.error('[MAIL ERROR]', e);
  }

  // Abschlussantwort
  res.status(200).json({
    status: '✅ Health Check ausgeführt',
    serverTime: new Date().toISOString(),
    api: 'ok',
    build: process.env.VERCEL ? 'ok' : 'warn',

    db,
    dbSize,
    dbSizeRaw,
    dbSizePercent,
    dbError,

    mail,
    mailError,
  });
}
