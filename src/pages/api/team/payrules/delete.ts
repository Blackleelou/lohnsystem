import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht eingeloggt oder keine Firma zugeordnet' });
  }

  if (req.method !== 'DELETE') return res.status(405).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID fehlt oder ungültig' });
  }

  try {
    const result = await prisma.payRule.deleteMany({
      where: {
        id,
        companyId: session.user.companyId,
      },
    });

    if (result.count === 0) return res.status(404).json({ error: 'Lohnregel nicht gefunden' });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
