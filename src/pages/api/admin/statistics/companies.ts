// src/pages/api/admin/statistics/companies.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Dummy-API für Company-Statistiken
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({});
}
