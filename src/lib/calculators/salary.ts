/**
 * Salary / Take-Home Pay Calculator
 *
 * Simplified model: applies progressive tax brackets and social contributions.
 */

export interface TaxBracket {
  min: number;
  max: number;
  rate: number; // percentage
}

export interface SalaryInput {
  grossAnnual: number;
  countryCode: string;
  payFrequency: 'annual' | 'monthly' | 'biweekly' | 'weekly';
  pensionContribution?: number; // percentage
  bonus?: number;
}

export interface SalaryResult {
  grossAnnual: number;
  taxableIncome: number;
  incomeTax: number;
  socialContributions: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  netWeekly: number;
  effectiveTaxRate: number;
  marginalRate: number;
  breakdown: { label: string; amount: number }[];
}

export function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remaining = income;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
    tax += taxableInBracket * (bracket.rate / 100);
    remaining -= taxableInBracket;
  }

  return Math.round(tax * 100) / 100;
}

export function calculateSalaryUS(input: SalaryInput): SalaryResult {
  const { grossAnnual, pensionContribution = 0, bonus = 0 } = input;
  const totalGross = grossAnnual + bonus;

  // Standard deduction (2024 single filer)
  const standardDeduction = 14600;
  const taxableIncome = Math.max(0, totalGross - standardDeduction - totalGross * (pensionContribution / 100));

  // Federal tax brackets (2024 single)
  const brackets: TaxBracket[] = [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ];

  const incomeTax = calculateProgressiveTax(taxableIncome, brackets);

  // Social Security (6.2% up to $168,600)
  const ssWages = Math.min(totalGross, 168600);
  const socialSecurity = ssWages * 0.062;

  // Medicare (1.45% + 0.9% additional over $200k)
  let medicare = totalGross * 0.0145;
  if (totalGross > 200000) {
    medicare += (totalGross - 200000) * 0.009;
  }

  const socialContributions = Math.round((socialSecurity + medicare) * 100) / 100;
  const pensionDeduction = Math.round(totalGross * (pensionContribution / 100) * 100) / 100;
  const totalDeductions = Math.round((incomeTax + socialContributions + pensionDeduction) * 100) / 100;
  const netAnnual = Math.round((totalGross - totalDeductions) * 100) / 100;

  // Find marginal rate
  let marginalRate = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) marginalRate = bracket.rate;
  }

  return {
    grossAnnual: totalGross,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    incomeTax,
    socialContributions,
    totalDeductions,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
    netBiweekly: Math.round((netAnnual / 26) * 100) / 100,
    netWeekly: Math.round((netAnnual / 52) * 100) / 100,
    effectiveTaxRate: totalGross > 0 ? Math.round((totalDeductions / totalGross) * 10000) / 100 : 0,
    marginalRate,
    breakdown: [
      { label: 'Gross Income', amount: totalGross },
      { label: 'Standard Deduction', amount: -standardDeduction },
      { label: 'Pension Contribution', amount: -pensionDeduction },
      { label: 'Federal Income Tax', amount: -incomeTax },
      { label: 'Social Security', amount: -Math.round(socialSecurity * 100) / 100 },
      { label: 'Medicare', amount: -Math.round(medicare * 100) / 100 },
      { label: 'Net Take-Home', amount: netAnnual },
    ],
  };
}

export function calculateSalaryUK(input: SalaryInput): SalaryResult {
  const { grossAnnual, pensionContribution = 0, bonus = 0 } = input;
  const totalGross = grossAnnual + bonus;

  const pensionDeduction = totalGross * (pensionContribution / 100);
  const taxableIncome = Math.max(0, totalGross - pensionDeduction);

  const brackets: TaxBracket[] = [
    { min: 0, max: 12570, rate: 0 },
    { min: 12570, max: 50270, rate: 20 },
    { min: 50270, max: 125140, rate: 40 },
    { min: 125140, max: Infinity, rate: 45 },
  ];

  const incomeTax = calculateProgressiveTax(taxableIncome, brackets);

  // National Insurance
  let ni = 0;
  if (taxableIncome > 12570) {
    const upperLimit = Math.min(taxableIncome, 50270);
    ni += (upperLimit - 12570) * 0.08;
    if (taxableIncome > 50270) {
      ni += (taxableIncome - 50270) * 0.02;
    }
  }

  const socialContributions = Math.round(ni * 100) / 100;
  const totalDeductions = Math.round((incomeTax + socialContributions + pensionDeduction) * 100) / 100;
  const netAnnual = Math.round((totalGross - totalDeductions) * 100) / 100;

  let marginalRate = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) marginalRate = bracket.rate;
  }

  return {
    grossAnnual: totalGross,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    incomeTax,
    socialContributions,
    totalDeductions,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
    netBiweekly: Math.round((netAnnual / 26) * 100) / 100,
    netWeekly: Math.round((netAnnual / 52) * 100) / 100,
    effectiveTaxRate: totalGross > 0 ? Math.round((totalDeductions / totalGross) * 10000) / 100 : 0,
    marginalRate,
    breakdown: [
      { label: 'Gross Income', amount: totalGross },
      { label: 'Pension Contribution', amount: -Math.round(pensionDeduction * 100) / 100 },
      { label: 'Income Tax', amount: -incomeTax },
      { label: 'National Insurance', amount: -socialContributions },
      { label: 'Net Take-Home', amount: netAnnual },
    ],
  };
}

export function calculateSalaryGeneric(input: SalaryInput, config: {
  brackets: TaxBracket[];
  socialRate: number;
  currency: string;
}): SalaryResult {
  const { grossAnnual, pensionContribution = 0, bonus = 0 } = input;
  const totalGross = grossAnnual + bonus;
  const pensionDeduction = totalGross * (pensionContribution / 100);
  const taxableIncome = Math.max(0, totalGross - pensionDeduction);

  const incomeTax = calculateProgressiveTax(taxableIncome, config.brackets);
  const socialContributions = Math.round(totalGross * (config.socialRate / 100) * 100) / 100;

  const totalDeductions = Math.round((incomeTax + socialContributions + pensionDeduction) * 100) / 100;
  const netAnnual = Math.round((totalGross - totalDeductions) * 100) / 100;

  let marginalRate = 0;
  for (const bracket of config.brackets) {
    if (taxableIncome > bracket.min) marginalRate = bracket.rate;
  }

  return {
    grossAnnual: totalGross,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    incomeTax,
    socialContributions,
    totalDeductions,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
    netBiweekly: Math.round((netAnnual / 26) * 100) / 100,
    netWeekly: Math.round((netAnnual / 52) * 100) / 100,
    effectiveTaxRate: totalGross > 0 ? Math.round((totalDeductions / totalGross) * 10000) / 100 : 0,
    marginalRate,
    breakdown: [
      { label: 'Gross Income', amount: totalGross },
      { label: 'Pension Contribution', amount: -Math.round(pensionDeduction * 100) / 100 },
      { label: 'Income Tax', amount: -incomeTax },
      { label: 'Social Contributions', amount: -socialContributions },
      { label: 'Net Take-Home', amount: netAnnual },
    ],
  };
}
