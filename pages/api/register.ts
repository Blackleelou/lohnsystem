import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email und Passwort erforderlich.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'E-Mail ist bereits registriert.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Erfolgreich registriert' });
  } catch (error) {
    console.error('Fehler bei Registrierung:', error);
    return res.status(500).json({ message: 'Fehler bei der Registrierung.' });
  }
}