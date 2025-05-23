// Datei: pages/api/admin/board/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { title, status, category, notes } = req.body;

    if (!title || !status || !category) {
      return res.status(400).json({ message: "Titel, Status und Kategorie sind erforderlich." });
    }

    const createdEntry = await prisma.superadminBoardEntry.create({
      data: {
        title,
        status,
        category,
        notes,
        createdAt: new Date(),
      },
    });

    return res.status(201).json({ message: "Eintrag erfolgreich erstellt.", entry: createdEntry });
  } catch (err) {
    console.error("Fehler beim Erstellen:", err);
    return res.status(500).json({ message: "Fehler beim Speichern des Eintrags." });
  }
}
