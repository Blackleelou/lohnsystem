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

  const { title, content, format = "a4", companyId, visibility = "PRIVATE" } = req.body;

  // Sichtbarkeit validieren
  if (!["PRIVATE", "TEAM", "SHARED", "PUBLIC"].includes(visibility)) {
    return res.status(400).json({ error: "Ungültige Sichtbarkeit" });
  }

  try {
    // Vorschau-Modus: Kein Speichern, nur Rückgabe
    if (req.query.preview === "true") {
      return res.status(200).json({
        success: true,
        preview: true,
        document: {
          title,
          content,
          format,
          visibility,
          createdAt: new Date(),
        },
      });
    }

    // Wenn keine Firma: Privat-Dokument
    if (!companyId) {
      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content,
          format,
          ownerId: session.user.id,
          visibility,
        },
      });
      console.log("🆔 Dokument gespeichert:", doc.id);
      return res.status(200).json({ success: true, document: doc });
    }

    // Wenn companyId vorhanden: prüfen ob User dazugehört
    const member = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        companyId: companyId,
      },
    });

    if (!member) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Team" });
    }

    // Dokument mit Firmenzuordnung speichern
    const doc = await prisma.editorDocument.create({
      data: {
        title,
        content,
        format,
        companyId,
        visibility,
      },
    });

    console.log("🆔 Dokument gespeichert:", doc.id);
    return res.status(200).json({ success: true, document: doc });

  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return res.status(500).json({ error: "Fehler beim Speichern" });
  }
}
