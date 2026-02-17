import { describe, expect, it } from 'vitest';
import { calculateSalesTax } from '@/lib/calculators/sales-tax';

describe('Sales Tax Calculator', () => {
  it('calculates state-only sales tax', () => {
    const result = calculateSalesTax({ amount: 100, stateRate: 6, localRate: 0 });
    expect(result.stateTax).toBeCloseTo(6);
    expect(result.localTax).toBeCloseTo(0);
    expect(result.totalTax).toBeCloseTo(6);
    expect(result.total).toBeCloseTo(106);
  });

  it('calculates combined state + local tax', () => {
    const result = calculateSalesTax({ amount: 100, stateRate: 4, localRate: 4.5 });
    expect(result.stateTax).toBeCloseTo(4);
    expect(result.localTax).toBeCloseTo(4.5);
    expect(result.totalTax).toBeCloseTo(8.5);
    expect(result.total).toBeCloseTo(108.5);
  });

  it('handles zero tax states', () => {
    const result = calculateSalesTax({ amount: 200, stateRate: 0, localRate: 0 });
    expect(result.totalTax).toBe(0);
    expect(result.total).toBe(200);
  });

  it('calculates effective rate correctly', () => {
    const result = calculateSalesTax({ amount: 100, stateRate: 6.25, localRate: 1.25 });
    expect(result.effectiveRate).toBeCloseTo(7.5);
  });

  it('handles small amounts', () => {
    const result = calculateSalesTax({ amount: 1.5, stateRate: 7, localRate: 2 });
    expect(result.totalTax).toBeCloseTo(0.14);
    expect(result.total).toBeCloseTo(1.64);
  });
});
