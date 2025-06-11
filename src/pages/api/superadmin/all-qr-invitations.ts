import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email || session.user.email !== 'jantzen.chris@gmail.com') {
    return res.status(403).json({ error: 'Nicht autorisiert' });
  }

  try {
    const qrInvitations = await prisma.invitation.findMany({
      where: {
        type: { in: ['qr_simple', 'qr_protected'] },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        token: true,
        type: true,
        createdAt: true,
        expiresAt: true,
        password: true,
        companyId: true,
      },
    });

    return res.status(200).json({ invitations: qrInvitations });
  } catch (err) {
    console.error('Fehler beim Abrufen der Einladungen:', err);
    return res.status(500).json({ error: 'Fehler beim Abrufen' });
  }
}
