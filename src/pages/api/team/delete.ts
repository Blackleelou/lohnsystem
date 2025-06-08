// src/pages/api/team/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(400).json({ error: 'Kein Team zugeordnet' });
  }

  const companyId = session.user.companyId;

  // 1. Alle User rausnehmen und Felder zurücksetzen
  await prisma.user.updateMany({
    where: { companyId },
    data: {
      companyId: null,
      role: null,
      nickname: null,
      showName: true,
      showNickname: false,
      showEmail: false,
    },
  });

  // 2. Team löschen
  await prisma.company.delete({
    where: { id: companyId },
  });

  return res.status(200).json({ ok: true });
}
