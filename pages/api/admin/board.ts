// Datei: pages/api/admin/board.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const entries = await prisma.superadminBoardEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ entries });
  } catch (err) {
    console.error("Fehler beim Abrufen der Board-Einträge:", err);
    res.status(500).json({ message: "Fehler beim Laden der Daten" });
  }
}
