// src/pages/api/user/update-profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = await getToken({ req, secret });
    if (!token?.sub) {
      return res.status(401).json({ message: 'Nicht autorisiert' });
    }

    const userId = token.sub;

    const {
      name,
      nickname,
      showName,
      showEmail,
      showNickname,
    }: {
      name?: string;
      nickname?: string;
      showName: boolean;
      showEmail: boolean;
      showNickname: boolean;
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name?.trim() || undefined,
        nickname: nickname?.trim() || undefined,
        showName,
        showEmail,
        showNickname,
      },
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profil-Update fehlgeschlagen:', error);
    return res.status(500).json({ message: 'Interner Serverfehler' });
  }
}
