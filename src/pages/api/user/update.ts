import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { updateUserProfile } from '@/lib/db';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = token.sub!;
    const { firstname, lastname, username, email } = req.body;

    const updatedUser = await updateUserProfile(userId, {
      firstname,
      lastname,
      username,
      email,
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Update failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
