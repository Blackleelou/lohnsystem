
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  if (!email || !emailValid || !password || password.length < 6) {
    return res.status(400).json({ message: 'Ungültige Eingaben. Bitte gültige E-Mail und Passwort (min. 6 Zeichen) verwenden.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Diese E-Mail ist bereits registriert.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
  } catch (error) {
    console.error('Fehler bei Registrierung:', error);
    return res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
  }
}
