import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end('Method Not Allowed');

  const { id, title, status, category, notes } = req.body;

  try {
    const updated = await prisma.superadminBoardEntry.update({
      where: { id },
      data: {
        title,
        status,
        category: { set: category }, // ← Array korrekt setzen
        notes,
        completedAt: ['fertig', 'getestet'].includes(status.toLowerCase()) ? new Date() : null,
      },
    });
    res.status(200).json({ entry: updated });
  } catch (err) {
    console.error('Update-Fehler:', err);
    res.status(500).json({ message: 'Fehler beim Bearbeiten.' });
  }
}
