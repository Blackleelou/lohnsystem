import { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mg = new mailgun(formData);
  const client = mg.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY ?? 'HIER_API_KEY_EINFÜGEN',
  });

  const domain = process.env.MAILGUN_DOMAIN ?? 'mg.meinlohn.app';
  const to = req.body.to ?? 'test@blackleelou.de';

  console.log("Verwendete Domain:", domain);
  console.log("API Key gesetzt:", !!process.env.MAILGUN_API_KEY);
  console.log("Empfängeradresse:", to);

  try {
    const result = await client.messages.create(domain, {
      from: 'Lohnsystem <noreply@mg.meinlohn.app>',
      to: [to],
      subject: 'Testmail',
      text: 'Das ist eine Test-E-Mail vom Lohnsystem.',
    });

    return res.status(200).json({ message: 'Testmail gesendet', result });
  } catch (error) {
    console.error("Mailgun Fehler:", error);
    return res.status(500).json({ message: 'Fehler beim Versenden der Testmail.', error });
  }
}