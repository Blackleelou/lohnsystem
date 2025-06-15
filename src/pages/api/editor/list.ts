import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  try {
    const userId = session.user.id;
    const companyId = session.user.companyId;
    const userRole = session.user.role || "VIEWER";

    // Hole alle Dokumente, die in einer der folgenden Kategorien fallen:
    const documents = await prisma.editorDocument.findMany({
      where: {
        OR: [
          // Eigene Dokumente
          { ownerId: userId },

          // PUBLIC für alle sichtbar
          { visibility: "PUBLIC" },

          // TEAM-Dokumente, wenn man zur Firma gehört
          companyId
            ? {
                visibility: "TEAM",
                teamId: companyId,
              }
            : undefined,

          // SHARED, wenn explizit freigegeben
          {
            visibility: "SHARED",
            sharedWithUsers: {
              some: { id: userId },
            },
          },
        ].filter(Boolean),
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        visibility: true,
        format: true,
        updatedAt: true,
        ownerId: true,
        teamId: true,
      },
    });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Fehler beim Abrufen der Dokumente:", error);
    return res.status(500).json({ error: "Serverfehler" });
  }
}
