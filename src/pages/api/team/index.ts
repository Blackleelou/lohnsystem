// src/pages/api/team/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

function generatePassword(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // === TEAM ERSTELLEN ===
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Nicht eingeloggt' });
    }

    const { name, description, nickname, showName, showNickname, showEmail } = req.body;
    if (!name) return res.status(400).json({ error: 'Kein Name angegeben' });

    // Team-Name auf Einzigartigkeit prüfen
    const existing = await prisma.company.findFirst({ where: { name } });
    if (existing) {
      return res.status(400).json({
        error:
          'Es gibt bereits ein Team/Firma mit diesem Namen. Bitte wähle einen anderen Namen oder frage im Team nach.',
      });
    }

    // Team (Company) anlegen
    const company = await prisma.company.create({
      data: {
        name,
        description,
        createdAt: new Date(),
        users: {
          connect: { email: session.user.email },
        },
      },
    });

    // Direkt beim Erstellen: QR-Protected-Code hinzufügen
    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h gültig
    const password = generatePassword();

    await prisma.accessCode.create({
      data: {
        code: 'QR_PROTECTED_MAIN',
        companyId: company.id,
        password,
        validFrom: now,
        validUntil,
        role: 'viewer',
        requirePassword: true,
      },
    });

    // User updaten: Team-Zuweisung und Sichtbarkeit/Nickname
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyId: company.id,
        role: 'admin',
        nickname,
        showName: !!showName,
        showNickname: !!showNickname,
        showEmail: !!showEmail,
      },
    });

    return res.status(200).json({ teamId: company.id });
  }

  // === TEAM LÖSCHEN ===
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Nicht eingeloggt' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user?.companyId) {
        return res.status(400).json({ error: 'Kein Team zugeordnet' });
      }

      const companyId = user.companyId;

      const users = await prisma.user.findMany({ where: { companyId } });

      for (const u of users) {
        await prisma.user.update({
          where: { id: u.id },
          data: {
            companyId: null,
            role: null,
            nickname: null,
            showName: true,
            showNickname: false,
            showEmail: false,
          },
        });
      }

      await prisma.company.delete({
        where: { id: companyId },
      });

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Fehler beim Team-Löschen:', error);
      return res.status(500).json({ error: 'Fehler beim Löschen des Teams' });
    }
  }

  // === Alle anderen Methoden ===
  return res.status(405).json({ error: 'Method Not Allowed' });
}
