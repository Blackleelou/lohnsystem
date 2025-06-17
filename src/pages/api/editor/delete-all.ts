import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Nur für Debug/Testzwecke gedacht
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.email !== "jantzen.chris@gmail.com") {
    return res.status(403).json({ error: "Nicht erlaubt" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Nur DELETE erlaubt" });
  }

  try {
    await prisma.editorDocument.deleteMany({});
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Fehler beim Massenlöschen:", err);
    return res.status(500).json({ error: "Fehler beim Löschen aller Dokumente" });
  }
}
