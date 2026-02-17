/**
 * Hourly ↔ Salary Converter
 *
 * Formulas:
 * - Annual = hourly × hours/week × weeks/year
 * - Monthly = annual / 12
 * - Weekly = hourly × hours/week
 * - With overtime: regular hours at base rate, overtime hours at 1.5× rate
 */

export interface HourlySalaryInput {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  overtimeHours?: number; // weekly overtime hours
  overtimeMultiplier?: number; // default 1.5
}

export interface HourlySalaryResult {
  hourlyRate: number;
  weeklyPay: number;
  biweeklyPay: number;
  monthlyPay: number;
  annualPay: number;
  overtimePay: number;
  regularPay: number;
}

export function convertHourlyToSalary(input: HourlySalaryInput): HourlySalaryResult {
  const {
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    overtimeHours = 0,
    overtimeMultiplier = 1.5,
  } = input;

  if (hourlyRate < 0) throw new Error('Hourly rate must be non-negative');
  if (hoursPerWeek < 0 || hoursPerWeek > 168) throw new Error('Hours per week must be between 0 and 168');
  if (weeksPerYear < 0 || weeksPerYear > 52) throw new Error('Weeks per year must be between 0 and 52');

  const regularWeeklyPay = hourlyRate * hoursPerWeek;
  const overtimeWeeklyPay = hourlyRate * overtimeMultiplier * overtimeHours;
  const weeklyPay = regularWeeklyPay + overtimeWeeklyPay;
  const annualPay = weeklyPay * weeksPerYear;

  return {
    hourlyRate,
    weeklyPay: Math.round(weeklyPay * 100) / 100,
    biweeklyPay: Math.round(weeklyPay * 2 * 100) / 100,
    monthlyPay: Math.round((annualPay / 12) * 100) / 100,
    annualPay: Math.round(annualPay * 100) / 100,
    overtimePay: Math.round(overtimeWeeklyPay * weeksPerYear * 100) / 100,
    regularPay: Math.round(regularWeeklyPay * weeksPerYear * 100) / 100,
  };
}

export function convertSalaryToHourly(annualSalary: number, hoursPerWeek = 40, weeksPerYear = 52): number {
  return Math.round((annualSalary / (hoursPerWeek * weeksPerYear)) * 100) / 100;
}
