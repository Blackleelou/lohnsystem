import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Methode nicht erlaubt' });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.companyId)
    return res.status(401).json({ error: 'Nicht autorisiert' });

  // --- Body validieren -----------------------------
  const { id, title, rate, type } = req.body;

  const parsedRate = typeof rate === 'string'
    ? parseFloat(rate.replace(',', '.'))
    : rate;

  if (!id || !title || isNaN(parsedRate)) {
    return res.status(400).json({ error: 'Ungültige Eingabedaten' });
  }

  if (type !== 'HOURLY' && type !== 'MONTHLY') {
    return res.status(400).json({ error: 'Ungültiger Lohntyp' });
  }
  // -------------------------------------------------

  try {
    const payrule = await prisma.payRule.findUnique({ where: { id } });

    if (!payrule || payrule.companyId !== session.user.companyId) {
      return res.status(404).json({ error: 'Nicht gefunden oder keine Berechtigung' });
    }

    const updated = await prisma.payRule.update({
      where: { id },
      data: {
        title: title.trim(),
        rate: parsedRate,
        type,
      },
    });

    return res.status(200).json(updated);   // ⬅ Frontend erhält fertiges Objekt
  } catch (err) {
    console.error('Fehler beim Update der Lohnregel:', err);
    return res.status(500).json({ error: 'Speichern fehlgeschlagen' });
  }
}
