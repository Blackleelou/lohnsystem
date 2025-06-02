// src/pages/api/admin/health.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    db: "ok",
    mail: "warn",
    api: "ok",
    build: "ok",
    serverTime: new Date().toISOString(),
    // ...später echte Checks!
  });
}
