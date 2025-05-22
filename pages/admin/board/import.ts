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
};

export const config = {
  api: {
    bodyParser: false, // für FormData
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    // Raw file upload (via formidable workaround)
    const chunks: Buffer[] = [];

    req.on("data", chunk => chunks.push(chunk));
    req.on("end", async () => {
      const boundary = req.headers["content-type"]?.split("boundary=")?.[1];
      if (!boundary) return res.status(400).json({ message: "Invalid upload." });

      const raw = Buffer.concat(chunks).toString("utf8");
      const jsonPart = raw.split("\r\n\r\n")[2]?.split("\r\n")[0];
      if (!jsonPart) return res.status(400).json({ message: "Keine JSON-Daten erkannt." });

      const newEntries: Entry[] = JSON.parse(jsonPart);
      const oldRaw = await fs.readFile(boardPath, "utf-8");
      const existing: Entry[] = JSON.parse(oldRaw);

      const merged: Entry[] = [...existing];

      for (const entry of newEntries) {
        const matchIndex = merged.findIndex(e => e.id === entry.id || e.title === entry.title);

        if (matchIndex !== -1) {
          // Überschreiben (vorsichtig)
          merged[matchIndex] = {
            ...merged[matchIndex],
            ...entry,
          };
        } else {
          merged.push(entry);
        }
      }

      await fs.writeFile(boardPath, JSON.stringify(merged, null, 2), "utf-8");
      return res.status(200).json({ message: "Import erfolgreich abgeschlossen." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Fehler beim Importieren." });
  }
}
