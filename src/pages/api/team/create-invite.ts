import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  const { role, expiresInHours } = req.body;

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + (expiresInHours || 48) * 60 * 60 * 1000);

  const invite = await prisma.invitation.create({
    data: {
      token,
      companyId: session.user.companyId,
      role: role || "viewer",
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const joinUrl = `${baseUrl}/join/${invite.token}`;

  res.status(200).json({
    success: true,
    invitation: {
      token: invite.token,
      role: invite.role,
      expiresAt: invite.expiresAt,
      joinUrl,
    },
  });
}
