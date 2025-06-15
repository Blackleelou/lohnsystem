import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result: any = {
    status: 'Healthcheck gestartet',
    time: new Date().toISOString(),
    db: {
      status: 'pending',
    },
    mail: {
      status: 'pending',
    },
    build: process.env.VERCEL ? 'ok' : 'warn',
    api: 'ok',
    consentDebug: null,
    errors: [],
    warnings: [],
  };

  try {
    const { consent } = req.body || {};
    if (consent) {
      result.consentDebug = {
        statistik: consent.statistik,
        marketing: consent.marketing,
      };
    }

    // DB-Test
    try {
      await prisma.user.findFirst();
      result.db.status = 'ok';
    } catch (err: any) {
      result.db.status = 'error';
      result.db.error = 'Fehler bei Prisma: ' + String(err);
      result.errors.push(result.db.error);
    }

    // DB-Größe + Speicherfresser
    try {
      const raw: any = await prisma.$queryRawUnsafe(`
        SELECT 
          pg_size_pretty(pg_database_size(current_database())) AS size_pretty,
          pg_database_size(current_database()) AS size_bytes;
      `);
      const sizePretty = raw?.[0]?.size_pretty || null;
      const sizeBytes = raw?.[0]?.size_bytes ?? null;
      const sizeBytesNumber = sizeBytes ? Number(sizeBytes) : null;

      const sizePercent = sizeBytesNumber
        ? Math.round((sizeBytesNumber / 10_000_000_000) * 100)
        : null;

      result.db.sizePretty = sizePretty;
      result.db.sizeBytes = sizeBytesNumber;
      result.db.sizePercent = sizePercent;

      if (sizePercent !== null && sizePercent >= 80) {
        result.warnings.push('Datenbank belegt über 80 % des Speicherlimits!');
      }

      const tableSizes: any = await prisma.$queryRawUnsafe(`
        SELECT
          table_name,
          pg_total_relation_size(quote_ident(table_name)) AS size
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY size DESC
        LIMIT 5;
      `);

      result.db.topTables = tableSizes.map((t: any) => ({
        name: t.table_name,
        sizeBytes: Number(t.size),
      }));

    } catch (err: any) {
      result.db.sizeError = 'Fehler beim Lesen der DB-Größe: ' + String(err);
      result.errors.push(result.db.sizeError);
    }

    // Mail-Test
    try {
      if (
        !process.env.MAIL_HOST ||
        !process.env.MAIL_USER ||
        !process.env.MAIL_PASS ||
        !process.env.MAIL_PORT
      ) {
        throw new Error('Eine oder mehrere MAIL_... Umgebungsvariablen fehlen');
      }

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

      result.mail.status = 'ok';

    } catch (err: any) {
      result.mail.status = 'error';
      result.mail.error = 'Fehler beim Mailversand: ' + String(err);
      result.errors.push(result.mail.error);
    }

    result.status = result.errors.length > 0 ? 'Warnungen oder Fehler' : 'Alles OK';
    res.status(200).json(result);

  } catch (err: any) {
    console.error('[API HEALTHCHECK FAILED]', err);
    res.status(500).json({
      status: 'Fataler Fehler in der API',
      error: String(err),
    });
  }
}
