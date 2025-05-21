import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { token, password } = req.body;
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ message: 'Ungültige Eingaben' });
  }

  const entry = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!entry || new Date() > entry.expiresAt) {
    return res.status(400).json({ message: 'Token ist ungültig oder abgelaufen.' });
  }

  const user = await prisma.user.findUnique({ where: { id: entry.userId } });
  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
  }

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    return res.status(400).json({ message: 'Das neue Passwort darf nicht mit dem alten übereinstimmen.' });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return res.status(200).json({ message: 'Passwort erfolgreich zurückgesetzt.' });
}
