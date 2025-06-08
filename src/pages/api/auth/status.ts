import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const loggedIn = !!cookies.userId;
  res.status(200).json({ loggedIn, cookie: cookies.userId || null });
}
