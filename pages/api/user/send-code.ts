
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import mailgun from 'mailgun.js';
import formData from 'form-data';

const nanoid = customAlphabet('1234567890', 6);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Ungültige E-Mail.' });

  const code = nanoid();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt: expires },
      create: { email, code, expiresAt: expires },
    });

    const mg = new mailgun(formData);
    const client = mg.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
    });

    await client.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: [email],
      subject: 'Dein Bestätigungscode',
      text: `Dein Code lautet: ${code} (gültig für 10 Minuten).`,
    });

    return res.status(200).json({ message: 'Code gesendet' });
  } catch (err) {
    console.error('Fehler beim Senden:', err);
    return res.status(500).json({ message: 'Serverfehler beim Versenden des Codes.' });
  }
}
