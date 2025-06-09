// /src/pages/api/admin/statistics/distribution.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeShifts } from "@/utils/normalizeShifts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const shifts = await prisma.shift.findMany({
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const normalized = normalizeShifts(shifts);

    res.status(200).json(normalized);
  } catch (error) {
    console.error("Fehler beim Abrufen der Schichten:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
