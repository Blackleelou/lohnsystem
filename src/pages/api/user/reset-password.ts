import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ message: 'Nicht eingeloggt' });

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Ungültige Eingaben' });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.password)
    return res.status(400).json({ message: 'User nicht gefunden oder kein Passwort vorhanden' });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Altes Passwort stimmt nicht' });

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame)
    return res
      .status(400)
      .json({ message: 'Das neue Passwort darf nicht mit dem alten übereinstimmen.' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashed },
  });

  return res.status(200).json({ message: 'Passwort geändert!' });
}
