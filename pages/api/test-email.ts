
import { NextApiRequest, NextApiResponse } from 'next';
import mailgun from 'mailgun.js';
import formData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mg = new mailgun(formData);
  const client = mg.client({
    username: 'api',
    key: 'key-xxx_your_real_api_key_here_xxx',
  });

  const domain = 'mg.meinlohn.app';
  const to = 'deine@emailadresse.de'; // <- hier echte Zieladresse eintragen

  try {
    const result = await client.messages.create(domain, {
      from: 'Lohnsystem <postmaster@mg.meinlohn.app>',
      to: [to],
      subject: 'Testmail vom Lohnsystem',
      text: 'Test erfolgreich! Deine Mailgun-Konfiguration funktioniert.',
    });

    console.log("Mailgun API Ergebnis:", result);
    return res.status(200).json({ message: 'Testmail gesendet', result });
  } catch (error) {
    console.error("Fehler beim Mailversand:", error);
    return res.status(500).json({ message: 'Fehler beim Mailversand', error });
  }
}
