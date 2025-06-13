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

  const { documentId, userId, companyId } = req.body;

  if (!documentId || (!userId && !companyId)) {
    return res.status(400).json({ error: "Ungültige Eingabe" });
  }

  try {
    const document = await prisma.editorDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({ error: "Dokument nicht gefunden" });
    }

    if (document.ownerId !== session.user.id) {
      return res.status(403).json({ error: "Nur Eigentümer kann freigeben" });
    }

    // Sichtbarkeit ändern
    if (document.visibility !== "SHARED") {
      await prisma.editorDocument.update({
        where: { id: documentId },
        data: { visibility: "SHARED" },
      });
    }

    // Bereits vorhandene Freigabe prüfen
    const existing = await prisma.editorShare.findFirst({
      where: {
        documentId,
        OR: [
          { sharedWithUserId: userId || undefined },
          { sharedWithCompanyId: companyId || undefined },
        ],
      },
    });

    if (existing) {
      return res.status(200).json({ success: true, alreadyShared: true });
    }

    // Neue Freigabe eintragen
    const newShare = await prisma.editorShare.create({
      data: {
        documentId,
        sharedWithUserId: userId || null,
        sharedWithCompanyId: companyId || null,
      },
    });

    return res.status(200).json({ success: true, share: newShare });
  } catch (error) {
    console.error("Fehler beim Teilen:", error);
    return res.status(500).json({ error: "Fehler beim Teilen" });
  }
}
