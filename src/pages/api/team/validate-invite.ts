// src/pages/api/team/validate-invite.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Kein gültiger Token übergeben' });
  }

  const invite = await prisma.invitation.findUnique({
    where: { token },
    include: {
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invite || new Date(invite.expiresAt) < new Date()) {
    return res.status(410).json({ error: 'Einladung ungültig oder abgelaufen' });
  }

  // 🔐 Fix für Passwortprüfung
  const passwordRequired =
    invite.type === 'qr_protected' &&
    typeof invite.password === 'string' &&
    invite.password.trim().length > 0;

  return res.status(200).json({
    ok: true,
    companyName: invite.company?.name || null,
    role: invite.role,
    type: invite.type,
    requirePassword: passwordRequired,
  });
}
