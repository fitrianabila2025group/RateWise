import { describe, expect, it } from 'vitest';
import { calculateLoan } from '@/lib/calculators/loan';

describe('Loan Calculator', () => {
  it('calculates a standard 30-year mortgage', () => {
    const result = calculateLoan({
      principal: 300000,
      annualRate: 6,
      termYears: 30,
      extraMonthlyPayment: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(1798.65, 0);
    expect(result.totalInterest).toBeGreaterThan(300000);
    expect(result.schedule).toHaveLength(360);
  });

  it('calculates total amount paid', () => {
    const result = calculateLoan({
      principal: 100000,
      annualRate: 5,
      termYears: 10,
      extraMonthlyPayment: 0,
    });
    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 120, 0);
  });

  it('extra payments reduce total interest', () => {
    const noExtra = calculateLoan({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
      extraMonthlyPayment: 0,
    });
    const withExtra = calculateLoan({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
      extraMonthlyPayment: 200,
    });
    expect(withExtra.totalInterest).toBeLessThan(noExtra.totalInterest);
    expect(withExtra.schedule.length).toBeLessThan(noExtra.schedule.length);
  });

  it('handles 0% interest rate', () => {
    const result = calculateLoan({
      principal: 12000,
      annualRate: 0,
      termYears: 1,
      extraMonthlyPayment: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(1000);
    expect(result.totalInterest).toBeCloseTo(0);
  });
});
