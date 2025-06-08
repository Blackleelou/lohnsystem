// src/pages/api/team/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Ungültige Team-ID' });
  }

  // Team und Mitglieder laden
  const team = await prisma.company.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!team) return res.status(404).json({ error: 'Team nicht gefunden' });

  res.status(200).json(team);
}
