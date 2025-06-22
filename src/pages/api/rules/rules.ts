// pages/api/rules.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' })
  }
  const companyId = session.user.companyId

  // GET: alle Rules listen
  if (req.method === 'GET') {
    const rules = await prisma.rule.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    })
    return res.status(200).json(rules)
  }

  // POST: neue Rule anlegen
  if (req.method === 'POST') {
    const data = req.body
    const rule = await prisma.rule.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        currency: data.currency,
        frequencyUnit: data.frequencyUnit,
        occurrenceLimit: data.occurrenceLimit,
        priority: data.priority,
        validFrom: new Date(data.validFrom),
        validTo: data.validTo ? new Date(data.validTo) : null,
        effects:    { create: data.effects },
        conditions: { create: data.conditions },
        targets:    { create: data.targets }
      },
      include: { effects: true, conditions: true, targets: true }
    })
    return res.status(201).json(rule)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
