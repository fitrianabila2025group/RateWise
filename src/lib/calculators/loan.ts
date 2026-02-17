/**
 * Loan / Mortgage Amortization Calculator
 *
 * Formula (monthly payment):
 *   M = P × [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   P = loan principal
 *   r = monthly interest rate (annual / 12)
 *   n = total number of payments (years × 12)
 */

export interface LoanInput {
  principal: number;
  annualRate: number; // percentage
  termYears: number;
  extraMonthlyPayment?: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payoffMonths: number;
  schedule: AmortizationRow[];
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termYears, extraMonthlyPayment = 0 } = input;

  if (principal <= 0) throw new Error('Principal must be positive');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');
  if (termYears <= 0) throw new Error('Term must be positive');

  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalPayments;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalPaid = 0;
  let totalInterestPaid = 0;

  for (let month = 1; month <= totalPayments; month++) {
    if (balance <= 0) break;

    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    let extra = Math.min(extraMonthlyPayment, balance - principalPayment);
    if (extra < 0) extra = 0;

    // Last payment adjustment
    if (principalPayment + extra > balance) {
      principalPayment = balance;
      extra = 0;
    }

    balance -= principalPayment + extra;
    totalPaid += monthlyPayment + extra;
    totalInterestPaid += interestPayment;

    schedule.push({
      month,
      payment: Math.round((principalPayment + interestPayment) * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      extraPayment: Math.round(extra * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
    });

    if (balance <= 0) break;
  }

  return {
    monthlyPayment,
    totalPayment: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterestPaid * 100) / 100,
    payoffMonths: schedule.length,
    schedule,
  };
}
