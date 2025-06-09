// /src/pages/api/admin/statistics/activity.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekAgo = subDays(todayStart, 7);
    const monthAgo = subDays(todayStart, 30);

    const [today, week, inactive] = await Promise.all([
      prisma.user.count({ where: { lastLogin: { gte: todayStart } } }),
      prisma.user.count({ where: { lastLogin: { gte: weekAgo } } }),
      prisma.user.count({ where: { lastLogin: { lte: monthAgo } } }),
    ]);

    res.status(200).json({ today, week, inactive });
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktivitätsdaten:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
