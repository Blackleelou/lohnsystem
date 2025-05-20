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

export async function updateUserProfile(userId: string, data: {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  steuerklasse?: string;
  kinderfreibetrag?: string;
  kirche?: boolean;
  iban?: string;
}) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}