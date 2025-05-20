import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, savePasswordResetToken } from '@/lib/db';
import { sendResetMail } from '@/lib/mail';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' });

  const user = await getUserByEmail(email);
  if (!user) return res.status(200).json({ success: true }); // absichtlich gleich

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 Stunde

  await savePasswordResetToken(user.id, token, expiresAt);
  await sendResetMail(user.email, token);

  res.status(200).json({ success: true });
}
