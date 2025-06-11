// src/pages/api/team/delete-invite.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht authentifiziert oder kein Team' });
  }

  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Ungültiger Token' });
  }

  try {
    const deleted = await prisma.invitation.deleteMany({
      where: {
        token,
        companyId: session.user.companyId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Einladung nicht gefunden oder nicht erlaubt' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
