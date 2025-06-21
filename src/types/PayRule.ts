// src/types/PayRule.ts
export type PayRule = {
  id: string;
  title: string;
  rate: number;
  type: 'HOURLY' | 'MONTHLY';
  group?: string;
  createdAt: string;
  ruleKind: 'PAY' | 'BONUS' | 'SPECIAL';
  percent?: number | null;
  fixedAmount?: number | null;
  onlyForAdmins?: boolean;
  oncePerYear?: boolean           // ➜ NEU
  onlyDecember?: boolean;
  perYear?: boolean;
  referenceType?: 'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT';
  validFrom?: string | null;
  validUntil?: string | null;
};
