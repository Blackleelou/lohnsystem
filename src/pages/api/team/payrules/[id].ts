// pages/api/team/payrules/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const payrule = await prisma.payRule.findUnique({
      where: { id },
    });

    if (!payrule || payrule.companyId !== session.user.companyId) {
      return res.status(404).json({ error: 'Nicht gefunden' });
    }

    return res.status(200).json(payrule);
  } catch (err) {
    return res.status(500).json({ error: 'Interner Fehler' });
  }
}
