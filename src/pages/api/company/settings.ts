import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: "Nicht angemeldet oder keine Firma" });
  }
  if (req.method === "GET") {
    const settings = await prisma.companySettings.findUnique({
      where: { companyId: session.user.companyId },
    });
    return res.status(200).json({ settings });
  }
  if (req.method === "POST") {
    const { themeName, useCustomColors, primaryColor, accentColor, bgLight, bgDark, textColor } = req.body;
    const updated = await prisma.companySettings.upsert({
      where: { companyId: session.user.companyId },
      update: { themeName, useCustomColors, primaryColor, accentColor, bgLight, bgDark, textColor },
      create: { companyId: session.user.companyId, themeName, useCustomColors, primaryColor, accentColor, bgLight, bgDark, textColor },
    });
    return res.status(200).json({ settings: updated });
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
