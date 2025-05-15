import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  // Lokale Test-Login-Daten
  if (email === 'test@user.de' && password === '12345678') {
    res.setHeader('Set-Cookie', serialize('userId', 'testuser', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24,
    }));
    return res.status(200).end();
  }

  return res.status(401).send('Login fehlgeschlagen');
}
