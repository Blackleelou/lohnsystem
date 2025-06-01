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

  // Nutzer & verbundene Firma holen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });

  if (!user?.company) {
    // KEIN 404 → damit das Frontend sauber weiterleitet!
    return res.status(200).json({});
  }

  // Hier kannst du weitere Felder zurückgeben, z.B. companyId
  return res.status(200).json({
    companyName: user.company.name,
    companyId: user.company.id,
  });
}
