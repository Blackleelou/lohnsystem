// src/pages/api/team/index.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Teamname erforderlich" });

    // Neuen "Team"-Eintrag anlegen (z.B. Company, falls im Prisma-Schema schon vorhanden)
    const team = await prisma.company.create({
      data: {
        name,
        description,
        // evtl. creatorId: session.user.id,
        // weitere Felder nach Bedarf
      },
    });

    // User bekommt das Team zugewiesen
    await prisma.user.update({
      where: { id: session.user.id },
      data: { companyId: team.id },
    });

    return res.status(201).json({ team });
  }

  res.status(405).json({ error: "Method not allowed" });
}
