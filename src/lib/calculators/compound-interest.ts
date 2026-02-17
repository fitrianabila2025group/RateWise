/**
 * Compound Interest Calculator
 *
 * Formula: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 * Where:
 *   P = initial principal
 *   r = annual interest rate (decimal)
 *   n = compounding frequency per year
 *   t = time in years
 *   PMT = periodic contribution
 */

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number; // percentage
  years: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
}

export interface YearlyBreakdown {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBreakdown[];
}

function getCompoundingN(frequency: CompoundInterestInput['compoundingFrequency']): number {
  switch (frequency) {
    case 'daily': return 365;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'annually': return 1;
  }
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, years, compoundingFrequency } = input;

  if (principal < 0) throw new Error('Principal must be non-negative');
  if (monthlyContribution < 0) throw new Error('Monthly contribution must be non-negative');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');
  if (years < 0 || years > 100) throw new Error('Years must be between 0 and 100');

  const n = getCompoundingN(compoundingFrequency);
  const r = annualRate / 100;
  const yearlyBreakdown: YearlyBreakdown[] = [];

  let balance = principal;
  let totalContributions = principal;
  let prevBalance = principal;

  for (let year = 1; year <= years; year++) {
    // Simulate month by month for accuracy with contributions
    for (let month = 1; month <= 12; month++) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;

      // Apply compounding for this month
      if (n >= 12) {
        // Monthly or more frequent: apply proportional compounding per month
        const periodsThisMonth = n / 12;
        for (let p = 0; p < periodsThisMonth; p++) {
          balance *= 1 + r / n;
        }
      } else {
        // Quarterly or annually: apply at end of applicable periods
        const monthsPerPeriod = 12 / n;
        if (month % monthsPerPeriod === 0) {
          balance *= 1 + r / n;
        }
      }
    }

    const yearInterest = balance - prevBalance - monthlyContribution * 12;

    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(totalContributions * 100) / 100,
      interest: Math.round((balance - totalContributions) * 100) / 100,
    });

    prevBalance = balance;
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round((balance - totalContributions) * 100) / 100,
    yearlyBreakdown,
  };
}
