import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res.status(403).json({ error: 'Kein Zugriff' });
  }

  const { companyId, newName } = req.body;
  if (!companyId || !newName) {
    return res.status(400).json({ error: 'Fehlende Parameter' });
  }

  const updated = await prisma.company.update({
    where: { id: companyId },
    data: { name: newName.trim() },
  });

  res.status(200).json({ success: true, company: updated });
}
