import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';

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

  const resetUrl = `https://${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('BREVO_API_KEY fehlt');
    return res.status(500).json({ message: 'Mail-Konfiguration fehlt.' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'Lohnsystem', email: 'noreply@meinlohn.app' },
        to: [{ email }],
        subject: 'Passwort zurücksetzen',
        htmlContent: `<p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        textContent: `Hier kannst du dein Passwort zurücksetzen: ${resetUrl}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Fehler von Brevo:', error);
      return res.status(500).json({ message: 'Fehler beim E-Mail-Versand.' });
    }

    return res.status(200).json({ message: 'Falls die E-Mail existiert, wurde ein Link gesendet.' });
  } catch (error) {
    console.error('Fehler beim Versenden:', error);
    return res.status(500).json({ message: 'Allgemeiner Fehler beim Versand.' });
  }
}
