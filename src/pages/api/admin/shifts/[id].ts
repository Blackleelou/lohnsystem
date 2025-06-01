import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const shift = await prisma.shift.findUnique({ where: { id: id as string } });
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(404).json({ message: "Not found" });
    }
    return;
  }

  if (req.method === "PUT") {
    const { userId, companyId, startTime, endTime, breakMinutes } = req.body;
    const shift = await prisma.shift.update({
      where: { id: id as string },
      data: { userId, companyId, startTime: new Date(startTime), endTime: new Date(endTime), breakMinutes },
    });
    res.status(200).json(shift);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.shift.delete({ where: { id: id as string } });
    res.status(200).json({ message: "Deleted" });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
