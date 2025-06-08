import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  const { code, password } = req.body;

  const access = await prisma.accessCode.findUnique({ where: { code } });
  if (!access || access.validUntil < new Date()) {
    return res.status(410).json({ error: 'Ungültiger oder abgelaufener Code.' });
  }

  if (access.requirePassword && access.password && access.password !== password) {
    return res.status(403).json({ error: 'Falsches Passwort.' });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      companyId: access.companyId,
      role: access.role,
      invited: true,
    },
  });

  res.status(200).json({ success: true });
}
