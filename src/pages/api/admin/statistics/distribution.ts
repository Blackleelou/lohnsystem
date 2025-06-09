import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeShifts } from "@/lib/utils"; // falls du diese Funktion selbst hast

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

    // Zeitangaben in Strings umwandeln
    const formattedShifts = shifts.map(s => ({
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
    }));

    const normalized = normalizeShifts(formattedShifts);
    res.status(200).json(normalized);
  } catch (error) {
    console.error("Fehler bei /distribution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
