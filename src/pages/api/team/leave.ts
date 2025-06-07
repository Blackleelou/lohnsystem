// src/pages/api/team/leave.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Aktuellen User ermitteln
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, companyId: true, role: true },
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, companyId, role } = dbUser;

    // Team verlassen
    await prisma.user.update({
      where: { id },
      data: {
        companyId: null,
        role: null,
        nickname: null,
      },
    });

    // Prüfen, ob es der letzte Admin war
    if (companyId && role === "admin") {
      const remainingAdmins = await prisma.user.count({
        where: { companyId, role: "admin" },
      });

      if (remainingAdmins === 0) {
        // Erst Editors prüfen
        const nextEditor = await prisma.user.findFirst({
          where: { companyId, role: "editor" },
        });

        if (nextEditor) {
          await prisma.user.update({
            where: { id: nextEditor.id },
            data: {
              role: "admin",
              promotedToAdmin: true, // optionales neues Flag (für Toast in Schritt 2)
            },
          });
        } else {
          // Wenn keine Editor → Viewer suchen
          const nextViewer = await prisma.user.findFirst({
            where: { companyId, role: "viewer" },
          });

          if (nextViewer) {
            await prisma.user.update({
              where: { id: nextViewer.id },
              data: {
                role: "admin",
                promotedToAdmin: true,
              },
            });
          }
        }
      }
    }

    return res.status(200).json({ message: "Erfolgreich aus dem Team ausgetreten" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
