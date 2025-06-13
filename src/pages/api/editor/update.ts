import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  const { id, title, content, format } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige Dokument-ID" });
  }

  try {
    const document = await prisma.editorDocument.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Dokument nicht gefunden" });
    }

    const userId = session.user.id;
    const companyId = session.user.companyId;

    const isOwner = document.ownerId === userId;

    const hasShare = await prisma.editorShare.findFirst({
      where: {
        documentId: id,
        OR: [
          { sharedWithUserId: userId },
          { sharedWithCompanyId: companyId },
        ],
      },
    });

    const isSharedEditable = document.visibility === "SHARED" && hasShare;

    if (!isOwner && !isSharedEditable) {
      return res.status(403).json({ error: "Kein Bearbeitungszugriff" });
    }

    const updated = await prisma.editorDocument.update({
      where: { id },
      data: {
        title,
        content,
        format,
      },
    });

    return res.status(200).json({ success: true, document: updated });
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    return res.status(500).json({ error: "Fehler beim Speichern" });
  }
}
