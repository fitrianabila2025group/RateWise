/**
 * FIRE (Financial Independence, Retire Early) Calculator
 *
 * Based on the 4% safe withdrawal rule:
 *   FIRE Number = Annual Expenses / Safe Withdrawal Rate
 *
 * Years to FIRE calculated using compound growth formula with annual contributions.
 */

export interface FireInput {
  annualExpenses: number;
  safeWithdrawalRate: number; // percentage, default 4
  currentSavings: number;
  annualContribution: number;
  expectedReturnRate: number; // percentage
}

export interface FireProjection {
  year: number;
  savings: number;
  target: number;
  progress: number; // percentage
}

export interface FireResult {
  fireNumber: number;
  yearsToFire: number;
  totalContributions: number;
  totalGrowth: number;
  projections: FireProjection[];
  coastFireNumber: number;
  leanFireNumber: number;
  fatFireNumber: number;
}

export function calculateFire(input: FireInput): FireResult {
  const { annualExpenses, safeWithdrawalRate, currentSavings, annualContribution, expectedReturnRate } = input;

  if (annualExpenses <= 0) throw new Error('Annual expenses must be positive');
  if (safeWithdrawalRate <= 0 || safeWithdrawalRate > 100) throw new Error('Safe withdrawal rate must be between 0 and 100');
  if (currentSavings < 0) throw new Error('Current savings must be non-negative');
  if (expectedReturnRate < 0) throw new Error('Expected return rate must be non-negative');

  const fireNumber = annualExpenses / (safeWithdrawalRate / 100);
  const leanFireNumber = (annualExpenses * 0.6) / (safeWithdrawalRate / 100);
  const fatFireNumber = (annualExpenses * 2) / (safeWithdrawalRate / 100);

  const returnRate = expectedReturnRate / 100;
  const projections: FireProjection[] = [];
  let savings = currentSavings;
  let yearsToFire = 0;
  let reached = false;

  // Calculate up to 60 years max
  for (let year = 0; year <= 60; year++) {
    const progress = Math.min(100, (savings / fireNumber) * 100);

    projections.push({
      year,
      savings: Math.round(savings * 100) / 100,
      target: Math.round(fireNumber * 100) / 100,
      progress: Math.round(progress * 100) / 100,
    });

    if (savings >= fireNumber && !reached) {
      yearsToFire = year;
      reached = true;
    }

    // Grow and contribute
    savings = savings * (1 + returnRate) + annualContribution;
  }

  if (!reached) {
    yearsToFire = -1; // Never reached
  }

  const totalContributions = currentSavings + annualContribution * Math.max(0, yearsToFire);
  const totalGrowth = fireNumber - totalContributions;

  // Coast FIRE: amount needed now (with 0 future contributions) to reach FIRE by age 65
  // Assumes 30 years of compounding
  const coastFireNumber = fireNumber / Math.pow(1 + returnRate, 30);

  return {
    fireNumber: Math.round(fireNumber * 100) / 100,
    yearsToFire,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalGrowth: Math.round(totalGrowth * 100) / 100,
    projections,
    coastFireNumber: Math.round(coastFireNumber * 100) / 100,
    leanFireNumber: Math.round(leanFireNumber * 100) / 100,
    fatFireNumber: Math.round(fatFireNumber * 100) / 100,
  };
}
