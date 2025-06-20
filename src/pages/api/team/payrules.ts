// src/pages/api/team/payrules.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.companyId) {
    return res.status(401).json({ error: 'Nicht eingeloggt oder keine Firma zugeordnet' });
  }

  try {
    const payrules = await prisma.payRule.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(payrules);
  } catch (error) {
    console.error('Fehler beim Abrufen der Lohnregeln:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
