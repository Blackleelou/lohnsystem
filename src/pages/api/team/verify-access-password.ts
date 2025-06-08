// src/pages/api/team/verify-access-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token oder Passwort fehlt.' });
  }

  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation || invitation.type !== 'qr_protected') {
    return res.status(404).json({ error: 'Einladung nicht gefunden oder kein Passwort erforderlich.' });
  }

  const now = new Date();
  const accessCode = await prisma.accessCode.findFirst({
    where: {
      companyId: invitation.companyId,
      validFrom: { lte: now },
      validUntil: { gte: now },
    },
  });

  if (!accessCode || accessCode.password !== password) {
    return res.status(403).json({ error: 'Passwort falsch oder nicht mehr gültig.' });
  }

  return res.status(200).json({ ok: true });
}
