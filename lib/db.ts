import { prisma } from '@/lib/prisma';

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function savePasswordResetToken(userId: string, token: string, expiresAt: Date) {
  await prisma.passwordResetToken.upsert({
    where: { userId },
    update: { token, expiresAt },
    create: { userId, token, expiresAt },
  });
}
