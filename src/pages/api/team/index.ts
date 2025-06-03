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

  // Aus dem Request Body die benötigten Werte holen:
  const { name, description, nickname, showName, showNickname, showEmail } = req.body;
  if (!name) return res.status(400).json({ error: "Kein Name angegeben" });

  // *** NEU: Doppelte Team-Namen abfangen ***
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
      // settings: { create: { ... } } // <- Sichtbarkeitsoptionen ggf. später!
    }
  });

  // User auf das Team setzen & persönliche Einstellungen/Nickname speichern
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      companyId: company.id,
      nickname, // Nickname wird übernommen!
      showName: !!showName,
      showNickname: !!showNickname,
      showEmail: !!showEmail,
    },
  });

  return res.status(200).json({ teamId: company.id });
}
