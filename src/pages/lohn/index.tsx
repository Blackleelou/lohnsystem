// src/pages/api/team/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // === TEAM ERSTELLEN ===
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Nicht eingeloggt" });
    }

    const { name, description, nickname, showName, showNickname, showEmail } = req.body;
    if (!name) return res.status(400).json({ error: "Kein Name angegeben" });

    // Team-Name auf Einzigartigkeit prüfen
    const existing = await prisma.company.findFirst({ where: { name } });
    if (existing) {
      return res.status(400).json({
        error: "Es gibt bereits ein Team/Firma mit diesem Namen. Bitte wähle einen anderen Namen oder frage im Team nach."
      });
    }

    // Team (Company) anlegen
    const company = await prisma.company.create({
      data: {
        name,
        description,
        createdAt: new Date(),
        users: {
          connect: { email: session.user.email }
        },
      }
    });

    // User updaten: Team-Zuweisung und Sichtbarkeit/Nickname
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyId: company.id,
        nickname,
        showName: !!showName,
        showNickname: !!showNickname,
        showEmail: !!showEmail,
      },
    });

    return res.status(200).json({ teamId: company.id });
  }

  // === TEAM LÖSCHEN ===
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.companyId) {
      return res.status(400).json({ error: "Kein Team zugeordnet" });
    }

    const companyId = session.user.companyId;

    // 1. Alle User vom Team lösen
    await prisma.user.updateMany({
      where: { companyId },
      data: { companyId: null },
    });

    // 2. Team/Firma löschen
    await prisma.company.delete({
      where: { id: companyId },
    });

    return res.status(200).json({ ok: true });
  }

  // === Andere Methoden: nicht erlaubt ===
  return res.status(405).json({ error: "Method Not Allowed" });
}
