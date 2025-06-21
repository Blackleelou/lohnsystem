// src/pages/api/team/payrules/rename-group.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Methode absichern
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  // Session prüfen
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  const { oldName, newName } = req.body;

  // Validierung
  if (typeof oldName !== 'string' || !oldName.trim()) {
    return res.status(400).json({ error: 'Ungültiger alter Gruppenname' });
  }
  if (typeof newName !== 'string' || !newName.trim()) {
    return res.status(400).json({ error: 'Ungültiger neuer Gruppenname' });
  }

  // Gruppenumwandlung: 'Allgemein' entspricht null
  const whereGroup = oldName === 'Allgemein' ? null : oldName.trim();
  const setGroup = newName === 'Allgemein' ? null : newName.trim();

  try {
    const result = await prisma.payRule.updateMany({
      where: {
        companyId: session.user.companyId,
        group: whereGroup,
      },
      data: {
        group: setGroup,
      },
    });

    return res.status(200).json({ updatedCount: result.count });
  } catch (error) {
    console.error('Fehler beim Umbenennen der Gruppe:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
