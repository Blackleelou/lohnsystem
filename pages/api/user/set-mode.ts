import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

  if (!email)
    return res.status(401).json({ error: "Nicht authentifiziert." });

  // ----> NEU: companyName aus dem Request holen!
  const { mode, companyName } = req.body;
  if (!["solo", "company"].includes(mode)) {
    return res.status(400).json({ error: "Ungültiger Modus" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User nicht gefunden" });

    // Nur bei Wechsel auf "company": ggf. neue Company anlegen
    if (mode === "company") {
      if (!user.companyId) {
        // ----> NEU: companyName prüfen und verwenden!
        const name =
          companyName && companyName.trim().length > 2
            ? companyName.trim()
            : user.name || "Meine Firma";

        // Debug-Ausgabe (optional)
        console.log("DEBUG companyName aus req.body:", companyName);
        console.log("DEBUG Firmenname wird gespeichert als:", name);

        // Neue Company erstellen
        const company = await prisma.company.create({
          data: {
            name,
          },
        });

        await prisma.user.update({
          where: { email },
          data: {
            mode,
            companyId: company.id,
            role: "admin",
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `Modus gewechselt auf: company + Firma erstellt`,
            ip: typeof ip === "string" ? ip : Array.isArray(ip) ? ip[0] : "unknown",
            timestamp: new Date(),
          },
        });

        return res.status(200).json({
          success: true,
          mode: "company",
          companyId: company.id,
          role: "admin",
          companyName: name, // <- Rückgabe für das Frontend
        });
      } else {
        // User hat schon eine Company, nur Modus setzen
        await prisma.user.update({
          where: { email },
          data: { mode },
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `Modus gewechselt auf: company (bereits Firma verknüpft)`,
            ip: typeof ip === "string" ? ip : Array.isArray(ip) ? ip[0] : "unknown",
            timestamp: new Date(),
          },
        });

        return res.status(200).json({
          success: true,
          mode: "company",
          companyId: user.companyId,
          role: user.role,
        });
      }
    } else {
      // Modus "solo", einfach setzen
      await prisma.user.update({
        where: { email },
        data: { mode },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: `Modus gewechselt auf: solo`,
          ip: typeof ip === "string" ? ip : Array.isArray(ip) ? ip[0] : "unknown",
          timestamp: new Date(),
        },
      });

      return res.status(200).json({ success: true, mode: "solo" });
    }
  } catch (err) {
    console.error("Fehler beim Modus-Update:", err);
    return res.status(500).json({ error: "Fehler beim Speichern des Modus" });
  }
}
