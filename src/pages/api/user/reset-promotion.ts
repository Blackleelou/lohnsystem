// src/pages/api/user/reset-promotion.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { promotedToAdmin: false },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting promotedToAdmin flag:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
