
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // sicherstellen, dass Prisma-Client korrekt eingerichtet ist

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Ungültige Eingaben. Passwort muss mindestens 6 Zeichen lang sein.' });
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
