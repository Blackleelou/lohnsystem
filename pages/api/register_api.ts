
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const rateLimitMap = new Map();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  if (now - entry.timestamp > 60000) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= 5) return true;

  rateLimitMap.set(ip, { count: entry.count + 1, timestamp: entry.timestamp });
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip.toString())) {
    return res.status(429).json({ message: 'Zu viele Registrierungsversuche. Bitte warte einen Moment.' });
  }

  let { email, password } = req.body;
  email = email.toLowerCase();

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

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Benutzer erfolgreich registriert.', user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({
      message: 'Serverfehler bei der Registrierung.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
