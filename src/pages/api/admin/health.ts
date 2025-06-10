import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 👉 Optionale Consent-Infos aus Request-Body extrahieren
  const { consent } = req.body || {};
  if (consent) {
    console.log('[Health Consent Debug]', {
      statistik: consent.statistik,
      marketing: consent.marketing,
    });
  }

  // ✅ DB-Check
  let db: 'ok' | 'warn' | 'error' = 'ok';
  try {
    await prisma.user.findFirst();
  } catch (e) {
    db = 'error';
  }

  // ✅ Mail-Service-Check
  let mail: 'ok' | 'warn' | 'error' = 'ok';
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
    mail = 'ok';
  } catch (e) {
    console.error('MAIL-CHECK-ERROR', e);
    mail = 'error';
  }

  const api: 'ok' = 'ok';
  const build: 'ok' | 'warn' | 'error' = process.env.VERCEL ? 'ok' : 'warn';

  res.status(200).json({
    db,
    mail,
    api,
    build,
    serverTime: new Date().toISOString(),
  });
}
