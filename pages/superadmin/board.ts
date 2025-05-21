import { promises as fs } from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const DATA_PATH = path.join(process.cwd(), "data/superadmin-board.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const content = await fs.readFile(DATA_PATH, "utf-8");
      const data = JSON.parse(content);
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const body = req.body;
      await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), "utf-8");
      return res.status(200).json({ message: "Gespeichert" });
    }

    return res.status(405).json({ message: "Nicht erlaubt" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler", error });
  }
}
