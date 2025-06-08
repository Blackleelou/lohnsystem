// pages/api/admin/board/delete.ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end('Method Not Allowed');

  const { id } = req.body;

  try {
    await prisma.superadminBoardEntry.delete({ where: { id } });
    res.status(200).json({ message: 'Eintrag gelöscht.' });
  } catch (err) {
    console.error('Lösch-Fehler:', err);
    res.status(500).json({ message: 'Fehler beim Löschen.' });
  }
}
