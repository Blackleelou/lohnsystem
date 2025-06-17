// src/pages/api/editor/load.ts

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

  const { id, shared } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Kein Dokument angegeben" });
  }

  try {
    const document = await prisma.editorDocument.findUnique({
      where: { id },
      include: {
        shares: true, // Für spätere Berechtigungen nützlich
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Dokument nicht gefunden" });
    }

    const userId = session.user.id;
    const companyId = session.user.companyId;

    // Zugriff prüfen
    const isOwner = document.ownerId === userId;
    const isSameCompany = document.companyId && companyId === document.companyId;
    const isShared = shared === "true";

    const isExplicitlyShared =
      document.shares.some(
        (share) =>
          share.sharedWithUserId === userId || share.sharedWithCompanyId === companyId
      );

    const canAccess =
      isOwner ||
      (document.visibility === "TEAM" && isSameCompany) ||
      (document.visibility === "SHARED" && isShared && isExplicitlyShared) ||
      document.visibility === "PUBLIC";

    if (!canAccess) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Dokument" });
    }

    // 🧪 JSON-Test: Ist der Inhalt speicherbar?
    try {
      JSON.stringify(document.content);
    } catch (e) {
      console.error("❌ Ungültiges JSON im content-Feld:", e);
      console.error("🔎 Dokumentinhalt war:", document.content);
      return res.status(500).json({ error: "Dokumentinhalt defekt oder nicht lesbar" });
    }

    // ✅ Alles in Ordnung
    return res.status(200).json({ success: true, document });

  } catch (err) {
    console.error("Fehler beim Laden des Dokuments:", err);
    return res.status(500).json({ error: "Fehler beim Laden" });
  }
}
