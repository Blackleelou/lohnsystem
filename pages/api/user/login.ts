import { getUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Login fehlgeschlagen');
  }

  const cookie = serialize('userId', user.id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: true,
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).end();
}
