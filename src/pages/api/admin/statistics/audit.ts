// src/pages/api/admin/statistics/audit.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Dummy-API für Audit-Logs
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({});
}
