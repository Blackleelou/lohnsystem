import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const start = parseInt((req.query._start as string) || "0", 10);
      const end = parseInt((req.query._end as string) || "10", 10);
      const take = end - start;

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          skip: start,
          take: take,
          orderBy: { createdAt: "desc" },
        }),
        prisma.company.count(),
      ]);
      res.setHeader("Content-Range", `companies ${start}-${end - 1}/${total}`);
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.status(200).json(companies);
      return;
    }

    if (req.method === "POST") {
      const { name, createdAt } = req.body;
      const company = await prisma.company.create({
        data: { name, createdAt },
      });
      res.status(201).json(company);
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API Fehler:", err);
    res.status(500).json({ error: err.message || err.toString() });
  }
}
