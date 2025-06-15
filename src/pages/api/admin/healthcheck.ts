// src/pages/api/admin/healthcheck.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'healthcheck OK ✅', time: new Date().toISOString() });
}
