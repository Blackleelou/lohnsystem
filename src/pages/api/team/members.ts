// src/pages/api/team/members.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(404).json({ members: [] });
  }

  const members = await prisma.user.findMany({
    where: { companyId: session.user.companyId },
    select: {
      id: true,
      name: true,
      nickname: true,
      email: true,
      role: true,
      invited: true,
      accepted: true,
      showName: true,        // Hier hinzugefügt
      showNickname: true,    // Hier hinzugefügt
      showEmail: true,       // Hier hinzugefügt
    },
  });

  res.status(200).json({ members });
}
