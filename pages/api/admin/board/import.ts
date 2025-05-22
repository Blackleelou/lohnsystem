import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import formidable, { File } from "formidable";

export const config = {
  api: {
    bodyParser: false, // wichtig für Datei-Upload
  },
};

const boardPath = path.join(process.cwd(), "data", "superadmin-board.json");

type Entry = {
  id: number;
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  updatedByImport?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = formidable({ maxFileSize: 2 * 1024 * 1024 });

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = files.file as File;
    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ message: "Keine Datei gefunden." });
    }

    const fileContent = await fs.readFile(uploadedFile.filepath, "utf-8");
    const incomingEntries: Entry[] = JSON.parse(fileContent);

    const existingRaw = await fs.readFile(boardPath, "utf-8");
    const currentEntries: Entry[] = JSON.parse(existingRaw);

    const merged: Entry[] = [...currentEntries];

    for (const incoming of incomingEntries) {
      const matchIndex = merged.findIndex(e =>
        e.id === incoming.id || e.title.toLowerCase() === incoming.title.toLowerCase()
      );

      if (matchIndex !== -1) {
        const existing = merged[matchIndex];

        const isIdentisch =
          existing.title === incoming.title &&
          existing.status === incoming.status &&
          existing.category === incoming.category &&
          existing.notes === incoming.notes &&
          existing.completedAt === incoming.completedAt;

        if (isIdentisch) continue;

        merged[matchIndex] = {
          ...existing,
          ...incoming,
          updatedByImport: true,
        };
      } else {
        merged.push(incoming);
      }
    }

    await fs.writeFile(boardPath, JSON.stringify(merged, null, 2), "utf-8");
    return res.status(200).json({ message: "Import erfolgreich durchgeführt." });
  } catch (error) {
    console.error("Fehler beim Import:", error);
    return res.status(500).json({ message: "Import fehlgeschlagen." });
  }
}
