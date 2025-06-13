import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige ID" });
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
    const isTeam = document.visibility === "TEAM" && document.companyId && document.companyId === companyId;

    const hasShare = await prisma.editorShare.findFirst({
      where: {
        documentId: document.id,
        OR: [
          { sharedWithUserId: userId },
          { sharedWithCompanyId: companyId },
        ],
      },
    });

    if (document.visibility === "PRIVATE" && !isOwner) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Dokument" });
    }

    if (document.visibility === "TEAM" && !isTeam && !hasShare) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Dokument" });
    }

    if (document.visibility === "SHARED" && !isOwner && !hasShare) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Dokument" });
    }

    return res.status(200).json({ document });
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    return res.status(500).json({ error: "Fehler beim Laden des Dokuments" });
  }
}
