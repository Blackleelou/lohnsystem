// src/pages/api/team/payrules/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'Ungültige ID' })

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.companyId)
    return res.status(401).json({ error: 'Nicht autorisiert' })

  /* ---------- GET: einzelne PayRule lesen ---------- */
  if (req.method === 'GET') {
    const payrule = await prisma.payRule.findUnique({ where: { id } })
    if (!payrule || payrule.companyId !== session.user.companyId)
      return res.status(404).json({ error: 'Nicht gefunden' })

    // Nur Felder zurückgeben, die das Frontend wirklich nutzt
    return res.status(200).json({
      id:            payrule.id,
      title:         payrule.title,
      group:         payrule.group,
      ruleKind:      payrule.ruleKind,
      type:          payrule.type,
      rate:          payrule.rate,
      percent:       payrule.percent,
      fixedAmount:   payrule.fixedAmount,
      onlyDecember:  payrule.onlyDecember,
      onlyForAdmins: payrule.onlyForAdmins,
      oncePerYear:   payrule.oncePerYear,   // ◀︎ neu
      validFrom:     payrule.validFrom,
      validUntil:    payrule.validUntil,
      createdAt:     payrule.createdAt,
    })
  }

  /* ---------- DELETE: PayRule löschen ---------- */
  if (req.method === 'DELETE') {
    const deleted = await prisma.payRule.delete({ where: { id } })
    return res.status(200).json(deleted)
  }

  return res.status(405).json({ error: 'Methode nicht erlaubt' })
}
