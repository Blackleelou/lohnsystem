import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const start = parseInt((req.query._start as string) || "0", 10);
    const end = parseInt((req.query._end as string) || "10", 10);
    const take = end - start;

    const [payrules, total] = await Promise.all([
      prisma.payRule.findMany({
        skip: start,
        take: take,
      }),
      prisma.payRule.count(),
    ]);

    res.setHeader("Content-Range", `payrules ${start}-${end - 1}/${total}`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.status(200).json(payrules);
    return;
  }

  if (req.method === "POST") {
    const { companyId, title, rate } = req.body;
    const payrule = await prisma.payRule.create({
      data: { companyId, title, rate },
    });
    res.status(201).json(payrule);
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
