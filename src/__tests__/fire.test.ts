import { describe, expect, it } from 'vitest';
import { calculateFire } from '@/lib/calculators/fire';

describe('FIRE Calculator', () => {
  it('calculates FIRE number with 4% rule', () => {
    const result = calculateFire({
      annualExpenses: 40000,
      currentSavings: 100000,
      annualContribution: 30000,
      expectedReturnRate: 7,
      safeWithdrawalRate: 4,
    });
    expect(result.fireNumber).toBe(1000000); // 40000 / 0.04
  });

  it('calculates lean and fat FIRE numbers', () => {
    const result = calculateFire({
      annualExpenses: 50000,
      currentSavings: 0,
      annualContribution: 25000,
      expectedReturnRate: 7,
      safeWithdrawalRate: 4,
    });
    expect(result.leanFireNumber).toBeLessThan(result.fireNumber);
    expect(result.fatFireNumber).toBeGreaterThan(result.fireNumber);
  });

  it('returns zero years if already at FIRE number', () => {
    const result = calculateFire({
      annualExpenses: 40000,
      currentSavings: 1500000,
      annualContribution: 0,
      expectedReturnRate: 7,
      safeWithdrawalRate: 4,
    });
    expect(result.yearsToFire).toBe(0);
  });

  it('calculates projections', () => {
    const result = calculateFire({
      annualExpenses: 40000,
      currentSavings: 50000,
      annualContribution: 20000,
      expectedReturnRate: 7,
      safeWithdrawalRate: 4,
    });
    expect(result.projections.length).toBeGreaterThan(0);
    // Projections should be growing
    const first = result.projections[0];
    const last = result.projections[result.projections.length - 1];
    expect(last.savings).toBeGreaterThan(first.savings);
  });
});
