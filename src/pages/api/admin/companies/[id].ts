import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { extractErrorMessage } from "@/lib/apiError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    if (req.method === "GET") {
      const company = await prisma.company.findUnique({ where: { id: id as string } });
      if (company) res.status(200).json(company);
      else res.status(404).json({ message: "Not found" });
      return;
    }
    if (req.method === "PUT") {
      const { name } = req.body;
      const company = await prisma.company.update({
        where: { id: id as string },
        data: { name },
      });
      res.status(200).json(company);
      return;
    }
    if (req.method === "DELETE") {
      // **User zurücksetzen**
      await prisma.user.updateMany({
        where: { companyId: id as string },
        data: {
          companyId: null,
        },
      });

      // **Firma löschen**
      await prisma.company.delete({ where: { id: id as string } });

      res.status(200).json({ message: "Deleted" });
      return;
    }
    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
  const errorMsg = extractErrorMessage(err);
  res.status(500).json({ error: errorMsg });
}
}
}
