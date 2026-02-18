'use client';

import { useState } from 'react';
import { calculateCompoundInterest, type CompoundInterestResult } from '@/lib/calculators/compound-interest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

export function CompoundInterestForm() {
  const [principal, setPrincipal] = useState('10000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually' | 'daily'>('monthly');
  const [result, setResult] = useState<CompoundInterestResult | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseInt(years);
    if (isNaN(p) || isNaN(m) || isNaN(r) || isNaN(y)) return;

    const res = calculateCompoundInterest({
      principal: p,
      monthlyContribution: m,
      annualRate: r,
      years: y,
      compoundingFrequency: frequency,
    });
    setResult(res);
  };

  const resultText = result
    ? `Final Balance: $${formatNumber(result.finalBalance)} | Total Contributions: $${formatNumber(result.totalContributions)} | Total Interest: $${formatNumber(result.totalInterest)}`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compound Interest Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Initial Investment ($)</Label>
              <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} min="0" step="1000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution ($)</Label>
              <Input id="monthly" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} min="0" step="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0" max="50" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Time Period (Years)</Label>
              <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} min="1" max="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freq">Compounding Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as 'monthly')}>
                <SelectTrigger id="freq"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Final Balance</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary tabular-nums truncate">${formatNumber(result.finalBalance)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Contributions</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums truncate">${formatNumber(result.totalContributions)}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Interest Earned</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 tabular-nums truncate">${formatNumber(result.totalInterest)}</p>
                </div>
              </div>

              {/* Visual bar */}
              <div className="w-full h-8 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${(result.totalContributions / result.finalBalance) * 100}%` }}
                  title="Contributions"
                />
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${(result.totalInterest / result.finalBalance) * 100}%` }}
                  title="Interest"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Contributions ({Math.round((result.totalContributions / result.finalBalance) * 100)}%)</span>
                <span>Interest ({Math.round((result.totalInterest / result.finalBalance) * 100)}%)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Contributions</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyBreakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.balance)}</TableCell>
                        <TableCell className="text-right">${formatNumber(row.contributions)}</TableCell>
                        <TableCell className="text-right text-green-600">${formatNumber(row.interest)}</TableCell>
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
