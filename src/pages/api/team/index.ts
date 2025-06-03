// src/pages/api/team/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Kein Name angegeben" });

  // Neues Team anlegen
  const company = await prisma.company.create({
    data: {
      name,
      createdAt: new Date(),
      users: {
        connect: { email: session.user.email }
      },
    },
  });

  // User auf das Team setzen
  await prisma.user.update({
    where: { email: session.user.email },
    data: { companyId: company.id }
  });

  // Optional: description speichern (wenn im Modell vorhanden)
  // await prisma.company.update({ where: { id: company.id }, data: { description } });

  // Team-ID zurückgeben
  return res.status(200).json({ teamId: company.id });
}
