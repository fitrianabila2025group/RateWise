/**
 * VAT Calculator
 *
 * Formulas:
 * - Add VAT (exclusive): gross = net × (1 + rate/100); vat = net × rate/100
 * - Remove VAT (inclusive): net = gross / (1 + rate/100); vat = gross - net
 */

export interface VatInput {
  amount: number;
  rate: number;
  inclusive: boolean; // true = amount includes VAT, false = amount excludes VAT
}

export interface VatResult {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  rate: number;
}

export function calculateVat(input: VatInput): VatResult {
  const { amount, rate, inclusive } = input;

  if (amount < 0) throw new Error('Amount must be non-negative');
  if (rate < 0 || rate > 100) throw new Error('Rate must be between 0 and 100');

  let netAmount: number;
  let vatAmount: number;
  let grossAmount: number;

  if (inclusive) {
    // Amount includes VAT
    grossAmount = amount;
    netAmount = amount / (1 + rate / 100);
    vatAmount = grossAmount - netAmount;
  } else {
    // Amount excludes VAT
    netAmount = amount;
    vatAmount = amount * (rate / 100);
    grossAmount = netAmount + vatAmount;
  }

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100,
    rate,
  };
}
