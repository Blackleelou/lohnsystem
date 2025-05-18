
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import mailgun from 'mailgun.js';
import formData from 'form-data';

const nanoid = customAlphabet('1234567890', 32);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Ungültige E-Mail-Adresse.' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ message: 'Falls die E-Mail existiert, wurde ein Link gesendet.' });

  const token = nanoid();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 Stunde gültig

  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    update: { token, expiresAt: expires },
    create: { userId: user.id, token, expiresAt: expires },
  });

  const mg = new mailgun(formData);
  const client = mg.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
  });

  const domain = process.env.MAILGUN_DOMAIN || '';
  const resetUrl = `https://${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  try {
    await client.messages.create(domain, {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: [email],
      subject: 'Passwort zurücksetzen',
      text: `Hier kannst du dein Passwort zurücksetzen: ${resetUrl}`,
    });
    return res.status(200).json({ message: 'Falls die E-Mail existiert, wurde ein Link gesendet.' });
  } catch (error) {
    console.error('Fehler beim Senden der Reset-E-Mail:', error);
    return res.status(500).json({ message: 'Fehler beim Versenden der E-Mail.' });
  }
}
