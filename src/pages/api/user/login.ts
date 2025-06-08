import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.verified) {
    return res.status(401).json({ message: 'E-Mail wurde noch nicht bestätigt.' });
  }

  // Fix: Prüfen, ob ein Passwort gespeichert ist (z. B. Google-Login-Nutzer haben keins)
  if (!user.password) {
    return res.status(401).json({ message: 'Dieser Account hat kein Passwort (Google-Login?)' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Login fehlgeschlagen' });
  }

  const cookie = serialize('userId', user.id, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).end();
}
