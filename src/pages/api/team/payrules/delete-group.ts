// 📄 src/pages/api/team/payrules/delete-group.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  const group = req.query.group as string;

  if (!group) {
    return res.status(400).json({ error: 'Keine Gruppe angegeben' });
  }

  try {
    await prisma.payRule.deleteMany({
      where: {
        companyId: session.user.companyId,
        group: group,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen der Gruppe:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
