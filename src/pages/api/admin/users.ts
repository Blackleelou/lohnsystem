import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // ggf. Pfad anpassen!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const start = parseInt((req.query._start as string) || "0", 10);
    const end = parseInt((req.query._end as string) || "10", 10);
    const take = end - start;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: start,
        take: take,
        // select: { id: true, name: true, email: true } // anpassen, wenn du andere Felder hast
      }),
      prisma.user.count(),
    ]);

    res.setHeader("Content-Range", `users ${start}-${end - 1}/${total}`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.status(200).json(users);
    return;
  }

  // User anlegen
  if (req.method === "POST") {
    const { name, email } = req.body; // ggf. Felder anpassen
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
