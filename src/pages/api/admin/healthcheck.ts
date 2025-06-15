// src/pages/api/admin/healthcheck.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await prisma.user.findFirst(); // Testabfrage

    res.status(200).json({
      status: 'prisma OK ✅',
      firstUser: user ?? null,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ PRISMA FEHLER:', error);
    res.status(500).json({ error: 'Prisma nicht erreichbar', details: String(error) });
  }
}
