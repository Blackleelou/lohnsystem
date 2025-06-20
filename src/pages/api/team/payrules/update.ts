// src/pages/api/team/payrules/update.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Methode nicht erlaubt' })

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.companyId)
    return res.status(401).json({ error: 'Nicht autorisiert' })

  /* ---------- Body ---------- */
  const {
    id,
    title,
    rate,
    type,
    group,
    ruleKind,
    percent,
    fixedAmount,
    onlyDecember,
    onlyForAdmins,
    oncePerYear,
    validFrom,
    validUntil,
  } = req.body

  /* ---------- Validation ---------- */
  if (!id || typeof title !== 'string' || title.trim().length < 2)
    return res.status(400).json({ error: 'Ungültiger Titel oder ID' })

  if (!['PAY', 'BONUS', 'SPECIAL'].includes(ruleKind))
    return res.status(400).json({ error: 'Ungültiger Regeltyp' })

  let parsedRate: number | null = null
  let parsedPercent: number | null = null
  let parsedFixed: number | null = null

  if (ruleKind === 'PAY') {
    if (type !== 'HOURLY' && type !== 'MONTHLY')
      return res.status(400).json({ error: 'Ungültiger Lohntyp' })

    parsedRate = parseFloat(typeof rate === 'string' ? rate.replace(',', '.') : rate)
    if (isNaN(parsedRate) || parsedRate <= 0)
      return res.status(400).json({ error: 'Ungültiger Betrag' })
  }

  if (ruleKind === 'BONUS') {
    parsedPercent = parseFloat(typeof percent === 'string' ? percent.replace(',', '.') : percent)
    if (isNaN(parsedPercent) || parsedPercent <= 0)
      return res.status(400).json({ error: 'Ungültiger Prozentwert' })
  }

  if (ruleKind === 'SPECIAL') {
    parsedFixed = parseFloat(typeof fixedAmount === 'string' ? fixedAmount.replace(',', '.') : fixedAmount)
    if (isNaN(parsedFixed) || parsedFixed <= 0)
      return res.status(400).json({ error: 'Ungültiger Festbetrag' })
  }

  /* ---------- Update ---------- */
  try {
    const payrule = await prisma.payRule.findUnique({ where: { id } })
    if (!payrule || payrule.companyId !== session.user.companyId)
      return res.status(404).json({ error: 'Nicht gefunden oder keine Berechtigung' })

    const updated = await prisma.payRule.update({
      where: { id },
      data: {
        title: title.trim(),
        group: group?.trim() || null,
        ruleKind,

        /* PAY */
        type:         ruleKind === 'PAY' ? type : null,
        rate:         parsedRate,

        /* BONUS */
        percent:      parsedPercent,

        /* SPECIAL */
        fixedAmount:   parsedFixed,
        onlyDecember:  ruleKind === 'SPECIAL' ? onlyDecember  ?? false : undefined,
        onlyForAdmins: ruleKind === 'SPECIAL' ? onlyForAdmins ?? false : undefined,
        oncePerYear:   ruleKind === 'SPECIAL' ? oncePerYear   ?? false : undefined,
        validFrom:     ruleKind === 'SPECIAL' && validFrom  ? new Date(validFrom)  : undefined,
        validUntil:    ruleKind === 'SPECIAL' && validUntil ? new Date(validUntil) : undefined,
      },
    })

    return res.status(200).json(updated)
  } catch (err) {
    console.error('Fehler beim Update der Lohnregel:', err)
    return res.status(500).json({ error: 'Speichern fehlgeschlagen' })
  }
}
