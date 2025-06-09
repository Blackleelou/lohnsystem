import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { subWeeks, startOfWeek, format, getISOWeek, addDays } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const now = new Date();
    const weeks = Array.from({ length: 6 }, (_, i) => subWeeks(startOfWeek(now), i)).reverse();

    const userGrowth = await Promise.all(
      weeks.map(async (weekStart, idx) => {
        const weekEnd = weeks[idx + 1] ?? now;
        const count = await prisma.user.count({
          where: {
            createdAt: { gte: weekStart, lt: weekEnd },
          },
        });

        const label = `KW ${getISOWeek(weekStart)} (${format(weekStart, "dd.MM.")}–${format(addDays(weekStart, 6), "dd.MM.")})`;
        return { label, count };
      })
    );

    const companyGrowth = await Promise.all(
      weeks.map(async (weekStart, idx) => {
        const weekEnd = weeks[idx + 1] ?? now;
        const count = await prisma.company.count({
          where: {
            createdAt: { gte: weekStart, lt: weekEnd },
          },
        });

        const label = `KW ${getISOWeek(weekStart)} (${format(weekStart, "dd.MM.")}–${format(addDays(weekStart, 6), "dd.MM.")})`;
        return { label, count };
      })
    );

    res.status(200).json({ users: userGrowth, companies: companyGrowth });
  } catch (error) {
    console.error("Fehler bei GrowthStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
