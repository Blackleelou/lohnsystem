// pages/api/user/verify-code.ts (Backend-Logik)
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, code } = req.body;
  if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
    return res.status(400).json({ message: 'Ungültige Eingaben' });
  }

  const entry = await prisma.verificationCode.findUnique({ where: { email } });

  if (!entry || entry.code !== code || new Date() > entry.expiresAt) {
    return res.status(401).json({ message: 'Ungültiger oder abgelaufener Code.' });
  }

  await prisma.user.update({ where: { email }, data: { verified: true } });
  await prisma.verificationCode.delete({ where: { email } });

  return res.status(200).json({ message: 'Erfolgreich verifiziert.' });
}
