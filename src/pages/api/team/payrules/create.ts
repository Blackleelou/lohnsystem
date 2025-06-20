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

  const { title, rate, type, group, ruleKind, percent, fixedAmount } = req.body;

  // Titel prüfen
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return res.status(400).json({ error: 'Ungültiger Titel' });
  }

  // Regelart prüfen
  if (!['PAY', 'BONUS', 'SPECIAL'].includes(ruleKind)) {
    return res.status(400).json({ error: 'Ungültiger Regeltyp' });
  }

  // Betrag prüfen je nach Regeltyp
  let parsedRate: number | null = null;
  let parsedPercent: number | null = null;
  let parsedFixed: number | null = null;

  if (ruleKind === 'PAY') {
    if (type !== 'HOURLY' && type !== 'MONTHLY') {
      return res.status(400).json({ error: 'Ungültiger Lohntyp' });
    }
    parsedRate = parseFloat(typeof rate === 'string' ? rate.replace(',', '.') : rate);
    if (isNaN(parsedRate) || parsedRate <= 0) {
      return res.status(400).json({ error: 'Ungültiger Stundensatz' });
    }
  }

  if (ruleKind === 'BONUS') {
    parsedPercent = parseFloat(typeof percent === 'string' ? percent.replace(',', '.') : percent);
    if (isNaN(parsedPercent) || parsedPercent <= 0) {
      return res.status(400).json({ error: 'Ungültiger Prozentwert' });
    }
  }

  if (ruleKind === 'SPECIAL') {
    parsedFixed = parseFloat(typeof fixedAmount === 'string' ? fixedAmount.replace(',', '.') : fixedAmount);
    if (isNaN(parsedFixed) || parsedFixed <= 0) {
      return res.status(400).json({ error: 'Ungültiger Betrag für Sonderzahlung' });
    }
  }

  try {
    const payrule = await prisma.payRule.create({
      data: {
        companyId: session.user.companyId,
        title: title.trim(),
        group: group?.trim() || null,
        ruleKind,
        type: ruleKind === 'PAY' ? type : undefined,
        rate: parsedRate,
        percent: parsedPercent,
        fixedAmount: parsedFixed,
      },
    });

    return res.status(200).json(payrule);
  } catch (error) {
    console.error('Fehler beim Speichern der Lohnregel:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
