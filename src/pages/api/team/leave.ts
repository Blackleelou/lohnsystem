// src/pages/api/team/leave.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Nur POST-Anfragen erlauben
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Session prüfen
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // User aus DB holen (inkl. ID)
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // companyId, role und nickname auf null setzen (aus dem Team austreten)
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        companyId: null,
        role: null,
        nickname: null,
      },
    });

    return res.status(200).json({ message: "Erfolgreich aus dem Team ausgetreten" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
