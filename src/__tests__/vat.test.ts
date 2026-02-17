import { describe, expect, it } from 'vitest';
import { calculateVat } from '@/lib/calculators/vat';

describe('VAT Calculator', () => {
  it('adds VAT to net amount (exclusive)', () => {
    const result = calculateVat({ amount: 100, rate: 20, inclusive: false });
    expect(result.netAmount).toBe(100);
    expect(result.vatAmount).toBeCloseTo(20);
    expect(result.grossAmount).toBeCloseTo(120);
  });

  it('extracts VAT from gross amount (inclusive)', () => {
    const result = calculateVat({ amount: 120, rate: 20, inclusive: true });
    expect(result.netAmount).toBeCloseTo(100);
    expect(result.vatAmount).toBeCloseTo(20);
    expect(result.grossAmount).toBe(120);
  });

  it('handles 0% VAT', () => {
    const result = calculateVat({ amount: 100, rate: 0, inclusive: false });
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(100);
  });

  it('handles decimal amounts', () => {
    const result = calculateVat({ amount: 99.99, rate: 21, inclusive: false });
    expect(result.vatAmount).toBeCloseTo(20.9979);
    expect(result.grossAmount).toBeCloseTo(120.9879);
  });

  it('handles high VAT rates', () => {
    const result = calculateVat({ amount: 100, rate: 27, inclusive: false });
    expect(result.vatAmount).toBeCloseTo(27);
    expect(result.grossAmount).toBeCloseTo(127);
  });

  it('inclusive with 0% rate returns same amount', () => {
    const result = calculateVat({ amount: 100, rate: 0, inclusive: true });
    expect(result.netAmount).toBe(100);
    expect(result.vatAmount).toBe(0);
    expect(result.grossAmount).toBe(100);
  });
});
