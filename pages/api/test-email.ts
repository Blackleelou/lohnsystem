import { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const mg = new mailgun(formData);
  const client = mg.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
  });

  try {
    await client.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: ['DEINE.EMAIL@ADRESSE.DE'], // <<< Ersetze durch deine Test-E-Mail!
      subject: 'Testmail vom Lohnsystem',
      text: 'Diese Test-E-Mail wurde erfolgreich über Mailgun gesendet.',
    });

    return res.status(200).json({ message: 'Test-E-Mail wurde versendet.' });
  } catch (err) {
    console.error('Fehler beim Versenden der Testmail:', err);
    return res.status(500).json({ message: 'Fehler beim Versenden der Testmail.' });
  }
}
