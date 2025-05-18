import type { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

const mg = new mailgun(formData);
const client = mg.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '9cd0168378bf16be63d5ae53fc0c2fcf-e71583bb-88407e4e',
});

const domain = process.env.MAILGUN_DOMAIN || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await client.messages.create(domain, {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: ['deine@email.de'], // Hier deine Testadresse eintragen
      subject: 'Testmail von meinlohn.app',
      text: 'Das ist ein Test, ob Mailgun funktioniert.',
    });

    res.status(200).json({ message: 'Testmail versendet', result });
  } catch (error: any) {
    console.error('Fehler beim Mailversand:', error);
    res.status(500).json({
      message: 'Fehler beim Mailversand',
      error: {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        details: error?.response?.body || null,
      },
    });
  }
}
