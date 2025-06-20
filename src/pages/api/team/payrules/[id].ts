// pages/api/team/payrules/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const payrule = await prisma.payRule.findUnique({
      where: { id },
    });

    if (!payrule || payrule.companyId !== session.user.companyId) {
      return res.status(404).json({ error: 'Nicht gefunden' });
    }

    // Alles zurückgeben, auch Sonderfelder für SPECIAL
    return res.status(200).json({
      id: payrule.id,
      title: payrule.title,
      rate: payrule.rate,
      percent: payrule.percent,
      fixedAmount: payrule.fixedAmount,
      type: payrule.type,
      group: payrule.group,
      ruleKind: payrule.ruleKind,
      validFrom: payrule.validFrom,
      validUntil: payrule.validUntil,
      onlyDecember: payrule.onlyDecember,
      onlyForAdmins: payrule.onlyForAdmins,
      perYear: payrule.perYear,
      referenceType: payrule.referenceType,
      createdAt: payrule.createdAt,
    });
  } catch (err) {
    console.error('Fehler beim Laden der Lohnregel:', err);
    return res.status(500).json({ error: 'Interner Fehler' });
  }
}
