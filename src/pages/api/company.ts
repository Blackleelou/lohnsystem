import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Nicht eingeloggt' });
  }

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name fehlt' });

  const existing = await prisma.company.findFirst({ where: { name } });
  if (existing) {
    return res.status(400).json({ error: 'Firma existiert bereits' });
  }

  const company = await prisma.company.create({
    data: {
      name,
      createdAt: new Date(),
    },
  });

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      companyId: company.id,
      role: 'admin',
    },
  });

  return res.status(200).json({ companyId: company.id });
}
