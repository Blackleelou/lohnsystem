import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { consent } = req.body || {};
  if (consent) {
    console.log('[Health Consent Debug]', {
      statistik: consent.statistik,
      marketing: consent.marketing,
    });
  }

  let db: 'ok' | 'warn' | 'error' = 'ok';
  let dbSize: string | null = null;
  let dbSizeRaw: number | null = null;
  let dbSizePercent: number | null = null;
  let errorDbMessage: string | null = null;

  try {
    await prisma.user.findFirst();

    try {
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

    } catch (inner) {
      errorDbMessage = `Fehler bei DB-Größe: ${String(inner)}`;
      console.error('[DB-SIZE-CHECK-ERROR]', inner);
    }

  } catch (e) {
    db = 'error';
    errorDbMessage = `Fehler beim Zugriff auf Datenbank: ${String(e)}`;
    console.error('[DB-CHECK-ERROR]', e);
  }

  let mail: 'ok' | 'warn' | 'error' = 'ok';
  let errorMailMessage: string | null = null;

  try {
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

  } catch (e) {
    mail = 'error';
    errorMailMessage = `Fehler beim Mailversand: ${String(e)}`;
    console.error('[MAIL-CHECK-ERROR]', e);
  }

  const api: 'ok' = 'ok';
  const build: 'ok' | 'warn' | 'error' = process.env.VERCEL ? 'ok' : 'warn';

  res.status(200).json({
    status: 'Health-Check abgeschlossen',
    db,
    mail,
    api,
    build,
    serverTime: new Date().toISOString(),
    dbSize,
    dbSizeRaw,
    dbSizePercent,
    errorDbMessage,
    errorMailMessage,
  });
}
