import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId || !session.user.id) return res.status(401).end();

  const { role, type, password, note } = req.body;

  const validTypes = ["qr_basic", "qr_password", "link_once"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: "Ungültiger Einladungs-Typ." });
  }

  // Ablaufdauer je nach Typ
  let expiresInMs: number;
  if (type === "qr_basic") {
    expiresInMs = 1000 * 60 * 60 * 24 * 30; // 30 Tage
  } else if (type === "qr_password") {
    expiresInMs = 1000 * 60 * 60 * 24 * 7; // 7 Tage (konfigurierbar)
  } else {
    expiresInMs = 1000 * 60 * 10; // Einmal-Link: nur 10 Minuten aktiv
  }

  const expiresAt = new Date(Date.now() + expiresInMs);

  const token = uuidv4();

  const invite = await prisma.invitation.create({
    data: {
      token,
      companyId: session.user.companyId,
      role: role || "viewer",
      expiresAt,
      used: false,
      createdBy: session.user.id,
    },
  });

  // Falls AccessCode nötig ist
  if (type === "qr_password") {
    await prisma.accessCode.create({
      data: {
        code: token.slice(0, 6).toUpperCase(), // z. B. „B3F92Z“
        companyId: session.user.companyId,
        role: role || "viewer",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h Passwort gültig
        requirePassword: true,
        password: password || "",
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const joinUrl = `${baseUrl}/join/${token}`;

  res.status(200).json({
    success: true,
    invitation: {
      token,
      joinUrl,
      type,
      expiresAt,
      note: note || null,
      password: password || null,
    },
  });
}
