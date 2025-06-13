import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  const { title, content, format, teamId } = req.body;

  try {
    // Check: Solo oder Team-Dokument?
    if (!teamId) {
      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content,
          format,
          ownerId: session.user.id,
          visibility: "PRIVATE",
        },
      });
      return res.status(200).json({ success: true, document: doc });
    } else {
      // Team-Mitglied prüfen (kann erweitert werden)
      const member = await prisma.user.findFirst({
        where: {
          id: session.user.id,
          companyId: teamId,
        },
      });

      if (!member) {
        return res.status(403).json({ error: "Kein Zugriff auf dieses Team" });
      }

      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content,
          format,
          teamId,
          visibility: "TEAM",
        },
      });

      return res.status(200).json({ success: true, document: doc });
    }
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return res.status(500).json({ error: "Fehler beim Speichern" });
  }
}
