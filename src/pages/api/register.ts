import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Ungültige Eingaben.' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Benutzer existiert bereits.' });

  const hashedPassword = await hash(password, 10);
  const isAdmin = email === 'jantzen.chris@gmail.com';

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      isAdmin,
      verified: false,
    },
  });

  return res.status(201).json({ message: 'Registrierung erfolgreich.' });
}
