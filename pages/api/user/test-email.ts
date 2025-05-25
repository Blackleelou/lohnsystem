import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'BREVO_API_KEY fehlt' });
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
        to: [{ email: 'jantzen.chris@gmail.com' }], // <-- hier deine echte Testadresse eintragen
        subject: 'Test-E-Mail vom Lohnsystem',
        htmlContent: `<p>Diese E-Mail bestätigt, dass Brevo korrekt eingerichtet ist.</p>`,
        textContent: 'Diese E-Mail bestätigt, dass Brevo korrekt eingerichtet ist.',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo Fehler:', error);
      return res.status(500).json({ message: 'Fehler beim E-Mail-Versand.', error });
    }

    return res.status(200).json({ message: 'Testmail gesendet' });
  } catch (error) {
    console.error('Allgemeiner Fehler:', error);
    return res.status(500).json({ message: 'Allgemeiner Fehler beim Versand.', error });
  }
}
