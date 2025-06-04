import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  const { password, expiresInHours, role } = req.body;

  const code = uuidv4().slice(0, 6).toUpperCase();
  const expiresAt = new Date(Date.now() + (expiresInHours || 24) * 60 * 60 * 1000);

  const accessCode = await prisma.accessCode.create({
    data: {
      code,
      companyId: session.user.companyId,
      password: password || null,
      expiresAt,
      role: role || "viewer",
    },
  });

  res.status(200).json({ code });
}
