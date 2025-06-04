import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Nicht angemeldet" });
  }

  // GET: Firma lesen
  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!user?.company) {
      return res.status(200).json({});
    }

    return res.status(200).json({
      companyName: user.company.name,
      companyId: user.company.id,
      role: user.role || null,
    });
  }

  // POST: Neue Firma anlegen
  if (req.method === "POST") {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Firmenname fehlt oder ungültig" });
    }

    try {
      // 1. Firma erstellen
      const newCompany = await prisma.company.create({
        data: { name },
      });

      // 2. User zum Admin machen und Firma zuweisen
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          companyId: newCompany.id,
          role: "admin",
        },
      });

      return res.status(200).json({
        companyId: newCompany.id,
        companyName: newCompany.name,
        message: "Firma erfolgreich erstellt",
      });
    } catch (err) {
      console.error("Fehler beim Erstellen der Firma:", err);
      return res.status(500).json({ error: "Serverfehler bei Firmenanlage" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
