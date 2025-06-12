import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  const {
    token,
    nickname,
    showName,
    showNickname,
    showEmail,
    password,
    realname,
  } = req.body;

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

  if (invitation.type === 'qr_protected') {
    const accessCode = await prisma.accessCode.findFirst({
      where: {
        companyId: invitation.companyId,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!accessCode || accessCode.password !== password) {
      return res.status(403).json({ error: 'Falsches oder fehlendes QR-Passwort.' });
    }
  }

  // ✅ Selbst-Degradierung verhindern
  const currentRole = session.user.role;
  const targetRole = invitation.role;

  if (
    currentRole &&
    targetRole &&
    currentRole !== targetRole &&
    (currentRole === 'admin' || currentRole === 'editor') &&
    invitation.createdById === session.user.id
  ) {
    return res.status(403).json({
      error:
        '⚠️ Einladung verweigert: Du kannst dich nicht selbst in eine niedrigere Rolle einladen.',
    });
  }

  // Daten vorbereiten
  const updateData: any = {
    companyId: invitation.companyId,
    role: invitation.role,
    invited: true,
    nickname,
    showName,
    showNickname,
    showEmail,
  };

  // ✅ Falls realname übergeben und aktueller Name leer ist → Name setzen
  if (!session.user.name && typeof realname === 'string' && realname.trim() !== '') {
    updateData.name = realname.trim();
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  if (invitation.type === 'single_use') {
    await prisma.invitation.delete({ where: { token } });
  }

  res.status(200).json({ success: true });
}
