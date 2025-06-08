import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).end();

  const { showName, showNickname, showEmail } = req.body;

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      showName: !!showName,
      showNickname: !!showNickname,
      showEmail: !!showEmail,
    },
  });

  return res.status(200).json({ success: true });
}
