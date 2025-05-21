import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data", "superadmin-board.json");

  try {
    const content = await fs.readFile(filePath, "utf-8");
    const entries = JSON.parse(content);
    res.status(200).json({ entries });
  } catch (err) {
    res.status(500).json({ error: "Board-Datei nicht gefunden oder fehlerhaft." });
  }
}
