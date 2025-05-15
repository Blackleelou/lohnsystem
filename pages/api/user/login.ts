import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  if (email === 'test@user.de' && password === '12345678') {
    const cookie = serialize("userId", "testuser", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).end();
  }

  return res.status(401).send("Login fehlgeschlagen");
}