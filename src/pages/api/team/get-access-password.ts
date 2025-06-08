// src/pages/api/team/get-access-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  const code = await prisma.accessCode.findFirst({
    where: {
      companyId: session.user.companyId,
      requirePassword: true,
      validUntil: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!code) return res.status(404).json({ error: 'Kein aktiver Zugangscode vorhanden' });

  return res.status(200).json({
    password: code.password,
    validUntil: code.validUntil,
  });
}
