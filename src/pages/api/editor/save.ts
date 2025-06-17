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

  if (!["PRIVATE", "TEAM", "SHARED", "PUBLIC"].includes(visibility)) {
    return res.status(400).json({ error: "Ungültige Sichtbarkeit" });
  }

  try {
    // 🧹 content bereinigen: null → ""
    const sanitizedContent = Array.isArray(content)
      ? content.map((el) => ({
          ...el,
          text: el.text ?? "",
        }))
      : content;

    if (req.query.preview === "true") {
      return res.status(200).json({
        success: true,
        preview: true,
        document: {
          title,
          content: sanitizedContent,
          format,
          visibility,
          createdAt: new Date(),
        },
      });
    }

    if (!companyId) {
      const doc = await prisma.editorDocument.create({
        data: {
          title,
          content: sanitizedContent,
          format,
          ownerId: session.user.id,
          visibility,
        },
      });
      console.log("🆔 Dokument gespeichert:", doc.id);
      return res.status(200).json({ success: true, document: doc });
    }

    const member = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        companyId: companyId,
      },
    });

    if (!member) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Team" });
    }

    const doc = await prisma.editorDocument.create({
      data: {
        title,
        content: sanitizedContent,
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
