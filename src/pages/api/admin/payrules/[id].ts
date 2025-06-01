import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const payrule = await prisma.payRule.findUnique({ where: { id: id as string } });
    if (payrule) {
      res.status(200).json(payrule);
    } else {
      res.status(404).json({ message: "Not found" });
    }
    return;
  }

  if (req.method === "PUT") {
    const { companyId, title, rate } = req.body;
    const payrule = await prisma.payRule.update({
      where: { id: id as string },
      data: { companyId, title, rate },
    });
    res.status(200).json(payrule);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.payRule.delete({ where: { id: id as string } });
    res.status(200).json({ message: "Deleted" });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
