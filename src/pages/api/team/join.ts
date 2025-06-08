import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  const { token, nickname, showName, showNickname, showEmail } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Kein gültiger Token übergeben.' });
  }

  if (
    typeof showName !== 'boolean' ||
    typeof showNickname !== 'boolean' ||
    typeof showEmail !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Ungültige Sichtbarkeitsdaten.' });
  }

  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation || invitation.expiresAt < new Date()) {
    return res.status(410).json({ error: 'Ungültige oder abgelaufene Einladung.' });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      companyId: invitation.companyId,
      role: invitation.role,
      invited: true,
      nickname,
      showName,
      showNickname,
      showEmail,
    },
  });

  await prisma.invitation.delete({ where: { token } });

  res.status(200).json({ success: true });
}
