// src/pages/api/editor/save.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  const { title, content, format, companyId } = req.body;

  // Grundlegende Validierung
  if (!title || !content || !format) {
    return res.status(400).json({ error: "Fehlende Felder: title, content oder format" });
  }

  try {
    if (!companyId) {
      // Solo-Dokument (privat)
      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content,
          format,
          ownerId: session.user.id,
          visibility: "PRIVATE",
        },
      });
      return res.json({ success: true, document: doc });
    } else {
      // Team-Zugehörigkeit prüfen
      const member = await prisma.user.findFirst({
        where: {
          id: session.user.id,
          companyId: companyId,
        },
      });

      if (!member) {
        return res.status(403).json({ error: "Kein Zugriff auf dieses Team" });
      }

      // Team-Dokument
      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content,
          format,
          companyId,
          visibility: "TEAM",
        },
      });

      return res.json({ success: true, document: doc });
    }
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return res.status(500).json({ error: "Fehler beim Speichern" });
  }
}
