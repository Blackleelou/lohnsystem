import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    'userId=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure'
  );
  res.status(200).end(); // Keine Weiterleitung mehr – handled clientseitig
}
