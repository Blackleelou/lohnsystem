// src/pages/api/team/from-invite.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Kein gültiger Token angegeben.' });
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        company: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Einladung nicht gefunden.' });
    }

    return res.status(200).json({
      team: {
        name: invitation.company?.name || 'Unbekanntes Team',
      },
      invitation: {
        printTitle: invitation.printTitle || '',
        printText: invitation.printText || '',
        printLogo: invitation.printLogo || null,
      },
    });
  } catch (err) {
    console.error('Fehler beim Laden der Einladung:', err);
    return res.status(500).json({ error: 'Serverfehler beim Einladungsabruf.' });
  }
}
