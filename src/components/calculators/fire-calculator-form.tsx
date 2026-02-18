'use client';

import { useState } from 'react';
import { calculateFire, type FireResult } from '@/lib/calculators/fire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

export function FireCalculatorForm() {
  const [expenses, setExpenses] = useState('40000');
  const [swr, setSwr] = useState('4');
  const [savings, setSavings] = useState('100000');
  const [contribution, setContribution] = useState('20000');
  const [returnRate, setReturnRate] = useState('7');
  const [result, setResult] = useState<FireResult | null>(null);

  const calculate = () => {
    const e = parseFloat(expenses);
    const s = parseFloat(swr);
    const c = parseFloat(savings);
    const a = parseFloat(contribution);
    const r = parseFloat(returnRate);
    if (isNaN(e) || isNaN(s) || isNaN(c) || isNaN(a) || isNaN(r)) return;

    const res = calculateFire({
      annualExpenses: e,
      safeWithdrawalRate: s,
      currentSavings: c,
      annualContribution: a,
      expectedReturnRate: r,
    });
    setResult(res);
  };

  const resultText = result
    ? `FIRE Number: $${formatNumber(result.fireNumber)} | Years to FIRE: ${result.yearsToFire === -1 ? 'Never' : result.yearsToFire}`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FIRE Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenses">Annual Expenses ($)</Label>
              <Input id="expenses" type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} min="0" step="1000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swr">Safe Withdrawal Rate (%)</Label>
              <Input id="swr" type="number" value={swr} onChange={(e) => setSwr(e.target.value)} min="1" max="10" step="0.25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savings">Current Savings ($)</Label>
              <Input id="savings" type="number" value={savings} onChange={(e) => setSavings(e.target.value)} min="0" step="10000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contribution">Annual Savings/Contribution ($)</Label>
              <Input id="contribution" type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} min="0" step="1000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return">Expected Annual Return (%)</Label>
              <Input id="return" type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} min="0" max="20" step="0.5" />
            </div>
          </div>
          <Button onClick={calculate} size="lg" className="w-full sm:w-auto">Calculate FIRE Number</Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your FIRE Results</CardTitle>
                <CopyResultsButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">FIRE Number</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-primary tabular-nums truncate">${formatNumber(result.fireNumber)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Years to FIRE</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold tabular-nums">{result.yearsToFire === -1 ? 'N/A' : result.yearsToFire}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Lean FIRE</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold tabular-nums truncate">${formatNumber(result.leanFireNumber)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Fat FIRE</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold tabular-nums truncate">${formatNumber(result.fatFireNumber)}</p>
                </div>
              </div>

              {/* Progress bar */}
              {result.projections.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progress to FIRE</span>
                    <span>{result.projections[0].progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-primary h-4 rounded-full transition-all"
                      style={{ width: `${Math.min(100, result.projections[0].progress)}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Coast FIRE Number (investing nothing more, retiring in 30 years): <strong>${formatNumber(result.coastFireNumber)}</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FIRE Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.projections.slice(0, Math.max(result.yearsToFire + 5, 20)).map((row) => (
                      <TableRow key={row.year} className={row.progress >= 100 ? 'bg-green-50' : ''}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.savings)}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.target)}</TableCell>
                        <TableCell className="text-right">
                          {row.progress >= 100 ? '✅ ' : ''}{row.progress}%
                        </TableCell>
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
