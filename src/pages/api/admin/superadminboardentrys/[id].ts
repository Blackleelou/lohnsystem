import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // oder: import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // GET: Ein einzelner Eintrag
    if (req.method === "GET") {
      const entry = await prisma.superadminBoardEntry.findUnique({ where: { id: id as string } });
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ message: "Not found" });
      }
      return;
    }

    // PUT: Eintrag bearbeiten
    if (req.method === "PUT") {
      const { title, status, category, notes, createdAt, completedAt, updatedByImport } = req.body;
      const entry = await prisma.superadminBoardEntry.update({
        where: { id: id as string },
        data: { title, status, category, notes, createdAt, completedAt, updatedByImport },
      });
      res.status(200).json(entry);
      return;
    }

    // DELETE: Eintrag löschen
    if (req.method === "DELETE") {
      await prisma.superadminBoardEntry.delete({ where: { id: id as string } });
      res.status(200).json({ message: "Deleted" });
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API Fehler:", err);
    res.status(500).json({ error: err.message || err.toString() });
  }
}
