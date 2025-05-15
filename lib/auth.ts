import { parse } from 'cookie';

export function getSessionUser(req) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  return cookies.userId || null;
}
