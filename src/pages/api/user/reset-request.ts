import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, savePasswordResetToken } from '@/lib/db';
import { sendResetMail } from '@/lib/mail';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' });

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      // absichtlich gleiche Antwort für Datenschutz
      return res.status(200).json({ success: true });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 Stunde gültig

    await savePasswordResetToken(user.id, token, expiresAt);
    await sendResetMail(user.email, token);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Reset-Mail Fehler:', err);
    return res
      .status(500)
      .json({ error: 'Fehler beim Zurücksetzen. Bitte später erneut versuchen.' });
  }
}
