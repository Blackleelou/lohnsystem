// src/pages/api/team/invitations.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        companyId: session.user.companyId,
        expiresAt: { gt: new Date() },
      },
      include: {
        createdByUser: true, // 🔁 automatisch sicher, auch wenn NULL
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    res.status(200).json({ invitations });
  } catch (error: any) {
    console.error('Fehler beim Laden der Einladungen:', error.message, error.stack);
    res.status(500).json({ error: 'Einladungen konnten nicht geladen werden.' });
  }
}
