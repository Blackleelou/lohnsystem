// src/pages/api/team/update-invite-print.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // ✅ korrekt
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  const { token, title, text, logo } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Ungültiger Token' });
  }

  try {
    const invitation = await prisma.invitation.findUnique({ where: { token } });

    if (!invitation) {
      return res.status(404).json({ error: 'Einladung nicht gefunden' });
    }

    if (invitation.companyId !== session.user.companyId) {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    await prisma.invitation.update({
      where: { token },
      data: {
        printTitle: title || null,
        printText: text || null,
        printLogo: logo || null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fehler beim Speichern der Druckdaten:', err);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
