import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Nur Admins dürfen Rollen ändern' });
  }

  const { userId, role } = req.body;

  if (!userId || !role || !['admin', 'editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Ungültige Eingabe' });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });

  if (!target || target.companyId !== session.user.companyId) {
    return res.status(404).json({ error: 'Benutzer nicht gefunden oder nicht im Team' });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return res.status(200).json({ success: true });
}
