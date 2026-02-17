/**
 * Sales Tax Calculator
 *
 * Formula: tax = amount × (rate / 100); total = amount + tax
 */

export interface SalesTaxInput {
  amount: number;
  stateRate: number;
  localRate?: number;
}

export interface SalesTaxResult {
  subtotal: number;
  stateTax: number;
  localTax: number;
  totalTax: number;
  total: number;
  effectiveRate: number;
}

export function calculateSalesTax(input: SalesTaxInput): SalesTaxResult {
  const { amount, stateRate, localRate = 0 } = input;

  if (amount < 0) throw new Error('Amount must be non-negative');
  if (stateRate < 0) throw new Error('State rate must be non-negative');
  if (localRate < 0) throw new Error('Local rate must be non-negative');

  const stateTax = amount * (stateRate / 100);
  const localTax = amount * (localRate / 100);
  const totalTax = stateTax + localTax;
  const total = amount + totalTax;
  const effectiveRate = amount > 0 ? (totalTax / amount) * 100 : 0;

  return {
    subtotal: Math.round(amount * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    localTax: Math.round(localTax * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    total: Math.round(total * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}
