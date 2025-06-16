// src/pages/api/editor/list.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { NextApiHandler } from "next";
import type { Prisma } from "@prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  try {
    const { id: userId, companyId } = session.user;

    // OR-Filter ohne undefined-Einträge
    const orFilters: Prisma.EditorDocumentWhereInput[] = [
      { ownerId: userId },                            // eigene Dokumente
      { visibility: "PUBLIC" },                       // öffentlich
      companyId && { visibility: "TEAM", teamId: companyId }, // Team
      {                                               // explizit geteilt
        visibility: "SHARED",
        sharedWithUsers: { some: { id: userId } },
      },
    ].filter(Boolean) as Prisma.EditorDocumentWhereInput[];

    const documents = await prisma.editorDocument.findMany({
      where: { OR: orFilters },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        visibility: true,
        format: true,
        updatedAt: true,
        ownerId: true,
        companyId: true,
      },
    });

    return res.status(200).json({ documents });
  } catch (err) {
    console.error("Fehler beim Abrufen der Dokumente:", err);
    return res.status(500).json({ error: "Serverfehler" });
  }
};

export default handler;
