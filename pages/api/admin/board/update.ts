// pages/api/admin/board/update.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).end("Method Not Allowed");

  const { id, title, status, category, notes, completedAt } = req.body;

  try {
    const updated = await prisma.superadminBoardEntry.update({
      where: { id },
      data: { title, status, category, notes, completedAt },
    });
    res.status(200).json({ entry: updated });
  } catch (err) {
    console.error("Update-Fehler:", err);
    res.status(500).json({ message: "Fehler beim Bearbeiten." });
  }
}
