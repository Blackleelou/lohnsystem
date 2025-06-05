// src/pages/api/team/create-invite.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) return res.status(401).end();

  const {
    role = "viewer",
    expiresInHours = 48,
    password = null,
    note = null,
    type = "qr_simple", // "qr_simple", "qr_protected", "single_use"
  } = req.body;

  const token = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000);

  const invite = await prisma.invitation.create({
    data: {
      token,
      companyId: session.user.companyId,
      role,
      expiresAt,
      password,
      note,
      type,
      createdById: session.user.id,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const joinUrl = `${baseUrl}/team/join/${token}`;

  return res.status(200).json({
    success: true,
    invitation: {
      token,
      joinUrl,
      expiresAt,
      role,
      note,
      type,
    },
  });
}
