import { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const mg = new mailgun(formData);
  const client = mg.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
  });

  try {
    const result = await client.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: ['test@meinlohn.app'], // kannst du durch deine Testadresse ersetzen
      subject: 'Test-E-Mail vom Lohnsystem',
      text: 'Diese E-Mail bestätigt, dass Mailgun korrekt eingerichtet ist.',
    });

    return res.status(200).json({ message: 'Testmail gesendet', result });
  } catch (error) {
    console.error('Fehler beim Versenden der Testmail:', error);
    return res.status(500).json({ message: 'Fehler beim Versenden der Testmail.', error });
  }
}
