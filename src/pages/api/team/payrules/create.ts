import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.companyId) {
    return res.status(401).json({ error: 'Nicht eingeloggt oder keine Firma zugeordnet' });
  }

  const { title, rate, type, group } = req.body;

  // Titel prüfen
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return res.status(400).json({ error: 'Ungültiger Titel' });
  }

  // Betrag parsen (auch Komma zulassen)
  const parsedRate = parseFloat(
    typeof rate === 'string' ? rate.replace(',', '.') : rate
  );
  if (isNaN(parsedRate) || parsedRate <= 0) {
    return res.status(400).json({ error: 'Ungültiger Betrag' });
  }

  // Typ prüfen
  if (type !== 'HOURLY' && type !== 'MONTHLY') {
    return res.status(400).json({ error: 'Ungültiger Lohntyp' });
  }

  try {
    const payrule = await prisma.payRule.create({
      data: {
        companyId: session.user.companyId,
        title: title.trim(),
        rate: parsedRate,
        type,
        group: group?.trim() || null, // ✅ optionales Gruppenfeld
      },
    });

    return res.status(200).json(payrule);
  } catch (error) {
    console.error('Fehler beim Speichern der Lohnregel:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
