import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId || !session.user?.id) return res.status(401).end();

  const { role, expiresInHours, type, note, password } = req.body;

  if (!['qr_simple', 'qr_protected', 'single_use'].includes(type)) {
    return res.status(400).json({ error: 'Ungültiger Einladungstyp' });
  }

  // Token- und Ablaufzeit vorbereiten
const token = uuidv4();
let expiresAt = new Date();
let singleUse = false;
let invitePassword: string | null = null;

// Einladungstyp-spezifische Regeln
if (type === 'qr_simple') {
  // QR-Code ohne Passwort → 30 Tage gültig
  expiresAt.setDate(expiresAt.getDate() + 30);
} else if (type === 'qr_protected') {
  // QR-Code mit Passwort → dauerhaft gültig, Passwort wird täglich erneuert (separater Mechanismus)
  expiresAt.setFullYear(expiresAt.getFullYear() + 10); // quasi "unendlich"
  invitePassword = password || ''; // beim Erstellen leer oder gesetzt
} else if (type === 'single_use') {
  // Einmal-Link → nur 1 Tag gültig & nur einmal verwendbar
  expiresAt.setDate(expiresAt.getDate() + 1);
  singleUse = true;
}

  const invite = await prisma.invitation.create({
    data: {
      token,
      companyId: session.user.companyId,
      role: role || 'viewer',
      expiresAt,
      used: false,
      createdBy: session.user.name || 'System',
      createdById: session.user.id,
      type,
      note: note || null,
      password: type === 'qr_protected' ? password || '' : null,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const joinUrl = `${baseUrl}/join/${invite.token}`;

  res.status(200).json({
    success: true,
    invitation: {
      token: invite.token,
      role: invite.role,
      expiresAt: invite.expiresAt,
      joinUrl,
    },
  });
}
