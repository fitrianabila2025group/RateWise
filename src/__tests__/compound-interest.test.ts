import { describe, expect, it } from 'vitest';
import { calculateCompoundInterest } from '@/lib/calculators/compound-interest';

describe('Compound Interest Calculator', () => {
  it('calculates simple compound interest without contributions', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 5,
      years: 10,
      monthlyContribution: 0,
      compoundingFrequency: 'annually',
    });
    expect(result.finalBalance).toBeCloseTo(16288.95, 0);
    expect(result.totalContributions).toBe(10000);
    expect(result.totalInterest).toBeCloseTo(6288.95, 0);
  });

  it('calculates with monthly contributions', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRate: 6,
      years: 5,
      monthlyContribution: 100,
      compoundingFrequency: 'monthly',
    });
    expect(result.totalContributions).toBeCloseTo(7000); // 1000 + 100*60
    expect(result.finalBalance).toBeGreaterThan(7000);
    expect(result.yearlyBreakdown).toHaveLength(5);
  });

  it('handles 0% interest rate', () => {
    const result = calculateCompoundInterest({
      principal: 5000,
      annualRate: 0,
      years: 3,
      monthlyContribution: 100,
      compoundingFrequency: 'monthly',
    });
    expect(result.totalContributions).toBeCloseTo(8600); // 5000 + 100*36
    expect(result.totalInterest).toBeCloseTo(0);
    expect(result.finalBalance).toBeCloseTo(8600);
  });

  it('compounding frequency affects results', () => {
    const annually = calculateCompoundInterest({
      principal: 10000,
      annualRate: 10,
      years: 5,
      monthlyContribution: 0,
      compoundingFrequency: 'annually',
    });
    const daily = calculateCompoundInterest({
      principal: 10000,
      annualRate: 10,
      years: 5,
      monthlyContribution: 0,
      compoundingFrequency: 'daily',
    });
    // Daily compounding should yield more than annual
    expect(daily.finalBalance).toBeGreaterThan(annually.finalBalance);
  });

  it('returns correct yearly breakdown length', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRate: 5,
      years: 20,
      monthlyContribution: 50,
      compoundingFrequency: 'quarterly',
    });
    expect(result.yearlyBreakdown).toHaveLength(20);
  });
});
