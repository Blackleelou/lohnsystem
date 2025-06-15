import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let db: 'ok' | 'warn' | 'error' = 'warn';
  let dbSize: string | null = null;
  let dbSizeRaw: number | null = null;
  let dbSizePercent: number | null = null;
  let dbError: string | null = null;

  try {
    const { prisma } = await import('@/lib/prisma');

    // ✅ Verbindung prüfen
    await prisma.user.findFirst();

    // 🔍 Größe abfragen (kann bei Neon fehlschlagen!)
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

      db = 'ok';
    } catch (inner) {
      db = 'warn';
      dbError = 'Verbindung OK, aber Abfrage pg_database_size() nicht erlaubt (Neon?)';
    }
  } catch (e: any) {
    db = 'error';
    dbError = e.message || 'Verbindung zur Datenbank fehlgeschlagen';
  }

  res.status(200).json({
    status: '✅ Health API erreichbar',
    serverTime: new Date().toISOString(),
    api: 'ok',
    build: process.env.VERCEL ? 'ok' : 'warn',

    db,
    dbSize,
    dbSizeRaw,
    dbSizePercent,
    dbError,
  });
}
