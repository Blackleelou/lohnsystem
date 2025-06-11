import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} nicht erlaubt` });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email || session.user.email !== 'jantzen.chris@gmail.com') {
    return res.status(403).json({ error: 'Nicht autorisiert' });
  }

  try {
    const result = await prisma.invitation.deleteMany({});
    return res.status(200).json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} Einladungen wurden global gelöscht.`,
    });
  } catch (error) {
    console.error('Fehler beim globalen Löschen:', error);
    return res.status(500).json({ error: 'Serverfehler beim Löschen' });
  }
}
