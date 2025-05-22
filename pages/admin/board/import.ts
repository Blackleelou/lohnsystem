import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

const boardPath = path.join(process.cwd(), "data", "superadmin-board.json");

type Entry = {
  id: number;
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  updatedByImport?: boolean; // <- HIER ERLAUBT
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const chunks: Buffer[] = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", async () => {
      const boundary = req.headers["content-type"]?.split("boundary=")?.[1];
      if (!boundary) return res.status(400).json({ message: "Fehlerhafter Upload (kein Boundary)." });

      const raw = Buffer.concat(chunks).toString("utf8");
      const jsonPart = raw.split("\r\n\r\n")[2]?.split("\r\n")[0];
      if (!jsonPart) return res.status(400).json({ message: "Keine JSON-Daten gefunden." });

      const incomingEntries: Entry[] = JSON.parse(jsonPart);
      const existingRaw = await fs.readFile(boardPath, "utf-8");
      const currentEntries: Entry[] = JSON.parse(existingRaw);

      const merged: Entry[] = [...currentEntries];

      for (const incoming of incomingEntries) {
        const matchIndex = merged.findIndex(e =>
          e.id === incoming.id || e.title.toLowerCase() === incoming.title.toLowerCase()
        );

        if (matchIndex !== -1) {
          const existing = merged[matchIndex];

          const isIdentical =
            existing.title === incoming.title &&
            existing.status === incoming.status &&
            existing.category === incoming.category &&
            existing.notes === incoming.notes &&
            existing.completedAt === incoming.completedAt;

          if (isIdentical) continue;

          merged[matchIndex] = {
            ...existing,
            ...incoming,
            updatedByImport: true, // wird akzeptiert durch Typ
          };
        } else {
          merged.push(incoming);
        }
      }

      await fs.writeFile(boardPath, JSON.stringify(merged, null, 2), "utf-8");
      return res.status(200).json({ message: "Import erfolgreich durchgeführt." });
    });
  } catch (err) {
    console.error("Importfehler:", err);
    return res.status(500).json({ message: "Interner Fehler beim Import." });
  }
}
