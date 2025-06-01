import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const start = parseInt((req.query._start as string) || "0", 10);
    const end = parseInt((req.query._end as string) || "10", 10);
    const take = end - start;

    const [shifts, total] = await Promise.all([
      prisma.shift.findMany({
        skip: start,
        take: take,
        // include: { user: true } // falls du User-Daten anzeigen willst
      }),
      prisma.shift.count(),
    ]);

    res.setHeader("Content-Range", `shifts ${start}-${end - 1}/${total}`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.status(200).json(shifts);
    return;
  }

  if (req.method === "POST") {
    // Passe die Felder an dein Modell an!
    const { userId, companyId, startTime, endTime, breakMinutes } = req.body;
    const shift = await prisma.shift.create({
      data: { userId, companyId, startTime: new Date(startTime), endTime: new Date(endTime), breakMinutes },
    });
    res.status(201).json(shift);
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
