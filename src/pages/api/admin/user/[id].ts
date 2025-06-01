import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // ggf. Pfad anpassen!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: id as string }
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Not found" });
    }
    return;
  }

  if (req.method === "PUT") {
    const { name, email } = req.body; // ggf. Felder anpassen
    const user = await prisma.user.update({
      where: { id: id as string },
      data: { name, email },
    });
    res.status(200).json(user);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id: id as string } });
    res.status(200).json({ message: "Deleted" });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
