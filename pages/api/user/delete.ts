import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Nicht autorisiert." });
  }

  try {
    const deleted = await prisma.user.delete({
      where: { email: session.user.email },
    });

    return res.status(200).json({ message: "Benutzerkonto gelöscht." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Benutzer existiert nicht mehr." });
    }

    console.error("Fehler beim Löschen:", error);
    return res.status(500).json({ message: "Fehler beim Löschen des Kontos." });
  }
}
