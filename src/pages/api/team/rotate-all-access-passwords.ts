// src/pages/api/team/rotate-all-access-passwords.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

function generatePassword(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });

  // 🔐 API-Key-Schutz
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.MY_CRON_SECRET) {
    return res.status(403).json({ error: 'Nicht autorisiert' });
  }

  const companies = await prisma.company.findMany({ select: { id: true } });
  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  let updatedCount = 0;

  for (const company of companies) {
    // alten Zugangscode (geschützt) löschen
    await prisma.accessCode.deleteMany({
      where: { companyId: company.id, requirePassword: true },
    });

    // Passwort erzeugen mit Kollisionsprüfung
    let newPassword: string;
    let exists: boolean;

    do {
      newPassword = generatePassword();
      exists = !!(await prisma.accessCode.findFirst({
        where: {
          password: newPassword,
          requirePassword: true,
          validUntil: { gte: now },
        },
      }));
    } while (exists);

    // neuen Zugangscode speichern
    await prisma.accessCode.create({
      data: {
        code: 'QR_PROTECTED_MAIN',
        companyId: company.id,
        password: newPassword,
        validFrom: now,
        validUntil,
        role: 'viewer',
        requirePassword: true,
      },
    });

    updatedCount++;
  }

  return res.status(200).json({ success: true, updatedCompanies: updatedCount });
}
