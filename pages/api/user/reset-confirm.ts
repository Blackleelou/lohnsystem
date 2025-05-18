import type { NextApiRequest, NextApiResponse } from 'next';
import { getResetTokenEntry, invalidateResetToken, updateUserPassword } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token und Passwort erforderlich' });
  }

  // Token aus DB prüfen
  const tokenEntry = await getResetTokenEntry(token);
  if (!tokenEntry || new Date(tokenEntry.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'Token ist ungültig oder abgelaufen' });
  }

  // Passwort hashen
  const hashed = await bcrypt.hash(newPassword, 10);

  // Passwort setzen
  await updateUserPassword(tokenEntry.userId, hashed);

  // Token ungültig machen (einmalige Nutzung)
  await invalidateResetToken(token);

  return res.status(200).json({ success: true });
}
