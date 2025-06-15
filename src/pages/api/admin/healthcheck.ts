import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let mail: 'ok' | 'error' = 'ok';

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HealthCheck Test" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: 'Mail-Test ✔️',
      text: 'Das ist ein Test.',
    });

    mail = 'ok';
  } catch (error) {
    console.error('MAIL-TEST-ERROR', error);
    mail = 'error';
  }

  res.status(200).json({
    mail,
    time: new Date().toISOString(),
  });
}
