// src/schemas/ruleSchema.ts
import { z } from 'zod'
import {
  RuleKind,
  PayRuleType,
  Currency,
  FrequencyUnit,
  EffectKind,
  ReferenceType,
  Operator
} from '@prisma/client'

export const ruleSchema = z.object({
  ruleKind:      z.nativeEnum(RuleKind),
  title:         z.string().min(1, 'Bitte gib einen Namen ein'),
  description:   z.string().optional(),
  currency:      z.nativeEnum(Currency).default(Currency.EUR),
  validFrom:     z.string().refine(s => !isNaN(Date.parse(s)), 'Ungültiges Datum'),
  validTo:       z.string().refine(s => !s || !isNaN(Date.parse(s))).nullable().optional(),

  // nur wenn ruleKind === PAY
  payType:       z.nativeEnum(PayRuleType).optional(),
  rate:          z.number().min(0).optional(),
  monthlyAmount: z.number().min(0).optional(),

  // für alle komplexeren Regeln
  frequencyUnit: z.nativeEnum(FrequencyUnit).optional(),
  effects:       z.array(
                     z.object({
                       kind:      z.nativeEnum(EffectKind),
                       value:     z.number().min(0),
                       reference: z.nativeEnum(ReferenceType)
                     })
                   ).optional(),
  conditions:    z.array(
                     z.object({
                       attribute: z.string().min(1),
                       operator:  z.nativeEnum(Operator),
                       jsonValue: z.any()
                     })
                   ).optional(),
  targets:       z.array(
                     z.object({
                       type:  z.string().min(1),
                       value: z.string().min(1)
                     })
                   ).optional()
})

// TypeScript-Typ für dein Formular
export type RuleForm = z.infer<typeof ruleSchema>
