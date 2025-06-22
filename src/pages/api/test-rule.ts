// pages/api/test-rule.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, EffectKind, ReferenceType, Operator, FrequencyUnit, Currency } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' })
  }
  try {
    const testRule = await prisma.rule.create({
      data: {
        companyId: "cmbxncou90003k00440wepfb9",         // <— hier anpassen!
        title:       'Test-Zuschlag',
        description: '2 €/h Vertretung Juni & Nov',
        currency:    Currency.EUR,
        frequencyUnit: FrequencyUnit.MONTHLY,
        occurrenceLimit: 1,
        priority:      1,
        validFrom:     new Date(),           // gilt ab jetzt
        // Effekte
        effects: {
          create: [{
            kind:      EffectKind.RATE,
            value:     2.0,
            reference: ReferenceType.ACTUAL_HOURS,
            note:      '2 €/h Test-Rate'
          }]
        },
        // Bedingungen
        conditions: {
          create: [
            { attribute: 'month',    operator: Operator.IN,  jsonValue: [6,11] },
            { attribute: 'shiftType',operator: Operator.EQ,  jsonValue: 'VERTRETUNG' }
          ]
        },
        // Zielgruppen
        targets: {
          create: [{ type: 'ROLE', value: 'MITARBEITER' }]
        }
      },
      include: { effects: true, conditions: true, targets: true }
    })
    res.status(201).json(testRule)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
