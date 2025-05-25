import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", reason: "Only POST is supported." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized", reason: "No active session." });
  }

  const email = session.user?.email;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized", reason: "Session has no email." });
  }

  const { mode } = req.body;
  if (!["solo", "company"].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode", reason: "Expected 'solo' or 'company'." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found", reason: `No user found with email ${email}` });
    }

    await prisma.user.update({
      where: { email },
      data: { mode },
    });

    return res.status(200).json({ success: true, message: `Modus '${mode}' gespeichert.` });
  } catch (err) {
    console.error("Fehler beim Update:", err);
    return res.status(500).json({ error: "DB update failed", reason: err instanceof Error ? err.message : "Unknown error" });
  }
}
