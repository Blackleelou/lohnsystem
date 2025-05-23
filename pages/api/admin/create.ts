// Datei: pages/api/admin/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { title, status, category, notes } = req.body;

    if (!title || !status || !category) {
      return res.status(400).json({ message: "Titel, Status und Kategorie sind erforderlich." });
    }

    const newEntry = await prisma.superadminBoardEntry.create({
      data: {
        title,
        status,
        category,
        notes,
        createdAt: new Date(),
        completedAt: status.toLowerCase() === "fertig" ? new Date() : null,
      },
    });

    return res.status(201).json({ message: "Eintrag erfolgreich erstellt.", entry: newEntry });
  } catch (error) {
    console.error("Fehler beim Erstellen:", error);
    return res.status(500).json({ message: "Fehler beim Speichern des Eintrags." });
  }
}
