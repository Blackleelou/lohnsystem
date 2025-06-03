// src/pages/api/team/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(404).json({ error: "Kein Team gefunden" });
  }

  const team = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { id: true, name: true, description: true, createdAt: true }
  });

  if (!team) return res.status(404).json({ error: "Kein Team gefunden" });

  res.status(200).json({ team });
}
