import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ status: "invalid", reason: "Kein oder ungültiger Token übergeben." });
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        company: { select: { name: true } },
      },
    });

    if (!invitation) {
      return res.status(404).json({ status: "not_found", reason: "Token nicht in der Datenbank gefunden." });
    }

    const now = new Date();
    const expired = invitation.expiresAt < now;

    // Versuch, einen Nutzer zu finden, der dieser Einladung bereits gefolgt ist
    const alreadyJoined = await prisma.user.findFirst({
      where: {
        companyId: invitation.companyId,
        invited: true,
      },
    });

    return res.status(200).json({
      status: expired ? "expired" : "valid",
      reason: expired ? "Token ist abgelaufen." : "Token ist gültig.",
      alreadyUsed: !!alreadyJoined,
      companyName: invitation.company?.name || null,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      role: invitation.role,
      type: invitation.type,
    });
  } catch (err: any) {
    return res.status(500).json({ status: "error", reason: "Serverfehler: " + err.message });
  }
}
