
import { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const mg = new mailgun(formData);
  const key = process.env.MAILGUN_API_KEY || '';
  const domain = process.env.MAILGUN_DOMAIN || '';
  const to = process.env.TEST_EMAIL_RECEIVER || 'test@meinlohn.app';

  console.log("Starte Mailgun-Test mit:", { key: key.slice(0, 10) + '...', domain });

  try {
    const client = mg.client({ username: 'api', key });

    const result = await client.messages.create(domain, {
      from: 'Lohnsystem <postmaster@mg.meinlohn.app>',
      to: [to],
      subject: 'Testmail von meinlohn.app',
      text: 'Wenn du diese E-Mail siehst, funktioniert dein Mailgun-Setup.',
    });

    console.log("Mailgun-Antwort:", result);
    return res.status(200).json({ message: 'Testmail versendet.', result });
  } catch (err) {
    console.error('Fehler beim Versenden der Testmail:', err);
    return res.status(500).json({ message: 'Fehler beim Versenden der Testmail.', error: err });
  }
}
