// src/pages/api/team/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Teamname fehlt" });
    }
    // Team (Company) anlegen
    const company = await prisma.company.create({
      data: {
        name,
        // Du kannst description speichern, falls im Modell vorhanden
      },
    });
    // User zuordnen (hier: als Admin)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { companyId: company.id, role: "admin" },
    });
    return res.status(201).json({ success: true, company });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
