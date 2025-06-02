// src/pages/api/admin/health.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // DB-Check
  let db: "ok" | "warn" | "error" = "ok";
  try {
    await prisma.user.findFirst();
  } catch (e) {
    db = "error";
  }

  // Mail-Service-Check mit echten SMTP-Daten aus .env
  let mail: "ok" | "warn" | "error" = "ok";
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // Brevo = STARTTLS/587 -> false
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Test: keine echte Mail senden, sondern nur verbinden (verify)
    await transporter.verify();
    // Wenn du wirklich eine Testmail schicken willst, dann:
    // await transporter.sendMail({
    //   from: process.env.MAIL_USER,
    //   to: process.env.MAIL_USER, // oder andere Zieladresse
    //   subject: "Health Check",
    //   text: "Test",
    // });
  } catch (e) {
    mail = "error";
  }

  const api: "ok" = "ok";
  const build: "ok" | "warn" | "error" = process.env.VERCEL ? "ok" : "warn";

  res.status(200).json({
    db,
    mail,
    api,
    build,
    serverTime: new Date().toISOString(),
  });
}
