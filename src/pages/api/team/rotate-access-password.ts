// src/pages/api/team/rotate-access-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

function generatePassword(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  const newPassword = generatePassword();
  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Bestehende Codes für diese Firma löschen (nur 1 erlaubt)
  await prisma.accessCode.deleteMany({
    where: { companyId: session.user.companyId, requirePassword: true },
  });

  const newCode = await prisma.accessCode.create({
    data: {
      code: 'QR_PROTECTED_MAIN', // optional fixiert, kann auch uuid sein
      companyId: session.user.companyId,
      password: newPassword,
      validFrom: now,
      validUntil,
      role: 'viewer', // oder konfigurierbar
      requirePassword: true,
    },
  });

  return res.status(200).json({
    password: newPassword,
    validUntil,
  });
}
