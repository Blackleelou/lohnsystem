import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Entry = {
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
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

    let importCount = 0;

    for (const entry of incomingEntries) {
      const existing = await prisma.superadminBoardEntry.findFirst({
        where: {
          OR: [
            { title: entry.title },
            { AND: [{ createdAt: new Date(entry.createdAt) }] }
          ],
        },
      });

      if (existing) {
        const isIdentical =
          existing.title === entry.title &&
          existing.status === entry.status &&
          existing.category === entry.category &&
          existing.notes === entry.notes &&
          (existing.completedAt?.toISOString() ?? null) === (entry.completedAt ?? null);

        if (isIdentical) continue;

        await prisma.superadminBoardEntry.update({
          where: { id: existing.id },
          data: {
            ...entry,
            createdAt: new Date(entry.createdAt),
            completedAt: entry.completedAt ? new Date(entry.completedAt) : null,
          },
        });
        importCount++;
      } else {
        await prisma.superadminBoardEntry.create({
          data: {
            ...entry,
            createdAt: new Date(entry.createdAt),
            completedAt: entry.completedAt ? new Date(entry.completedAt) : null,
          },
        });
        importCount++;
      }
    }

    return res.status(200).json({ message: `Import abgeschlossen (${importCount} Einträge verarbeitet)` });
  } catch (err) {
    console.error("Fehler beim Import:", err);
    return res.status(500).json({ message: "Import fehlgeschlagen." });
  }
}
