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
          id: true,
          name: true,
        },
      },
    },
  });

  if (!invite || new Date(invite.expiresAt) < new Date()) {
    return res.status(410).json({ error: 'Einladung ungültig oder abgelaufen' });
  }

  let passwordRequired = false;

  // 🔐 Prüfe ob für qr_protected ein aktiver AccessCode existiert
  if (invite.type === 'qr_protected') {
    const now = new Date();
    const accessCode = await prisma.accessCode.findFirst({
      where: {
        companyId: invite.company?.id,
        validFrom: { lte: now },
        validUntil: { gte: now },
        password: { not: null },
      },
    });

    passwordRequired = !!accessCode?.password?.trim();
  }

  return res.status(200).json({
    ok: true,
    companyName: invite.company?.name || null,
    role: invite.role,
    type: invite.type,
    requirePassword: passwordRequired,
  });
}
