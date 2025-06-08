import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import axios from 'axios';

const nanoid = customAlphabet('1234567890', 6);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string')
    return res.status(400).json({ message: 'Ungültige E-Mail.' });

  const code = nanoid();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt: expires },
      create: { email, code, expiresAt: expires },
    });

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Lohnsystem', email: 'noreply@meinlohn.app' },
        to: [{ email }],
        subject: 'Dein Verifizierungscode',
        htmlContent: `<p>Hallo,<br><br>Dein Code lautet: <strong>${code}</strong><br>Er ist 10 Minuten gültig.<br><br>Viele Grüße,<br>Lohnsystem</p>`,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY || '',
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ message: 'Code gesendet' });
  } catch (err) {
    console.error('Fehler beim Versand:', err);
    return res.status(500).json({ message: 'Serverfehler beim Versenden des Codes.' });
  }
}
