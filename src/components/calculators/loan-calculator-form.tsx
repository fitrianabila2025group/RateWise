'use client';

import { useState } from 'react';
import { calculateLoan, type LoanResult } from '@/lib/calculators/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

export function LoanCalculatorForm() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('30');
  const [extra, setExtra] = useState('0');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showAll, setShowAll] = useState(false);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseInt(term);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || t <= 0) return;

    const res = calculateLoan({
      principal: p,
      annualRate: r,
      termYears: t,
      extraMonthlyPayment: parseFloat(extra) || 0,
    });
    setResult(res);
  };

  const resultText = result
    ? `Monthly Payment: $${formatNumber(result.monthlyPayment)} | Total Interest: $${formatNumber(result.totalInterest)} | Total Paid: $${formatNumber(result.totalPayment)}`
    : '';

  const displaySchedule = result
    ? showAll
      ? result.schedule
      : result.schedule.filter((_, i) => (i + 1) % 12 === 0 || i === 0 || i === result.schedule.length - 1)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan & Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Loan Amount ($)</Label>
              <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} min="0" step="10000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0" max="30" step="0.125" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Loan Term (Years)</Label>
              <Input id="term" type="number" value={term} onChange={(e) => setTerm(e.target.value)} min="1" max="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Extra Monthly Payment ($) — optional</Label>
              <Input id="extra" type="number" value={extra} onChange={(e) => setExtra(e.target.value)} min="0" step="100" />
            </div>
          </div>
          <Button onClick={calculate} size="lg" className="w-full sm:w-auto">Calculate</Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results</CardTitle>
                <CopyResultsButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-primary tabular-nums truncate">${formatNumber(result.monthlyPayment)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-red-600 tabular-nums truncate">${formatNumber(result.totalInterest)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold tabular-nums truncate">${formatNumber(result.totalPayment)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Payoff</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold tabular-nums">{Math.floor(result.payoffMonths / 12)}y {result.payoffMonths % 12}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Amortization Schedule</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
                  {showAll ? 'Show Yearly' : 'Show All Months'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displaySchedule.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.payment)}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.principal)}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.interest)}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
