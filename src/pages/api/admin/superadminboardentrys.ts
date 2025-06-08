import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { extractErrorMessage } from '@/lib/apiError'; // Import GANZ OBEN!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // LIST: Alle Einträge (mit Pagination)
    if (req.method === 'GET') {
      const start = parseInt((req.query._start as string) || '0', 10);
      const end = parseInt((req.query._end as string) || '10', 10);
      const take = end - start;

      const [entries, total] = await Promise.all([
        prisma.superadminBoardEntry.findMany({
          skip: start,
          take: take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.superadminBoardEntry.count(),
      ]);

      res.setHeader('Content-Range', `superadminboardentrys ${start}-${end - 1}/${total}`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      res.status(200).json(entries);
      return;
    }

    // CREATE: Neuer Eintrag
    if (req.method === 'POST') {
      const { title, status, category, notes, createdAt, completedAt, updatedByImport } = req.body;
      const entry = await prisma.superadminBoardEntry.create({
        data: { title, status, category, notes, createdAt, completedAt, updatedByImport },
      });
      res.status(201).json(entry);
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    const errorMsg = extractErrorMessage(err);
    res.status(500).json({ error: errorMsg });
  }
}
