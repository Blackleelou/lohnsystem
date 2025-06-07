// src/pages/api/team/remove-member.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.companyId || session.user.role !== "admin") {
    return res.status(403).json({ error: "Nur Admins dürfen Mitglieder entfernen" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Kein Benutzer angegeben" });
  }

try {
  const userToRemove = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, companyId: true, role: true },
  });

  if (!userToRemove || userToRemove.companyId !== session.user.companyId) {
    return res.status(404).json({ error: "Benutzer nicht gefunden oder nicht im Team" });
  }

  // 💾 Vor dem Entfernen sichern:
  const companyId = userToRemove.companyId;
  const role = userToRemove.role;

  // Benutzer entfernen
  await prisma.user.update({
    where: { id: userId },
    data: {
      companyId: null,
      role: null,
      nickname: null,
      showName: true,
      showNickname: false,
      showEmail: false,
    },
  });

  // Wenn letzter Admin → Nachfolger bestimmen
  if (role === "admin") {
    const remainingAdmins = await prisma.user.count({
      where: { companyId, role: "admin" },
    });

    if (remainingAdmins === 0) {
      const nextEditor = await prisma.user.findFirst({
        where: { companyId, role: "editor" },
      });

      if (nextEditor) {
        await prisma.user.update({
          where: { id: nextEditor.id },
          data: {
            role: "admin",
            promotedToAdmin: true,
          },
        });
      } else {
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

  // Team löschen, wenn keine Mitglieder mehr
  const remainingMembers = await prisma.user.count({
    where: { companyId },
  });

  if (remainingMembers === 0) {
    await prisma.company.delete({
      where: { id: companyId },
    });
  }

  return res.status(200).json({ success: true });

} catch (error) {
  console.error("Fehler beim Entfernen des Teammitglieds:", error);
  return res.status(500).json({ error: "Serverfehler" });
}
}
