import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import nodemailer from 'nodemailer';

const nanoid = customAlphabet('1234567890', 6);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Ungültige E-Mail.' });

  const code = nanoid();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    // 1. Code speichern
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt: expires },
      create: { email, code, expiresAt: expires },
    });

    // 2. SMTP-Versand über Brevo
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Lohnsystem" <noreply@meinlohn.app>`,
      to: email,
      subject: 'Dein Bestätigungscode',
      text: `Hallo!\n\nDein Verifizierungscode lautet: ${code}\nEr ist 10 Minuten lang gültig.\n\nMit freundlichen Grüßen\nDein Lohnsystem-Team`,
    });

    return res.status(200).json({ message: 'Code gesendet' });
  } catch (err) {
    console.error('Fehler beim Versenden:', err);
    return res.status(500).json({ message: 'Serverfehler beim Versenden des Codes.' });
  }
}
