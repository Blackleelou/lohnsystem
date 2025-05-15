import { parse } from 'cookie';
import type { NextApiRequest } from 'next';

export function getSessionUser(req: NextApiRequest) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  return cookies.userId || null;
}