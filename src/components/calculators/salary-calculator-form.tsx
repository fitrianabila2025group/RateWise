'use client';

import { useState } from 'react';
import { calculateSalaryUS, calculateSalaryUK, calculateSalaryGeneric, type SalaryResult, type TaxBracket } from '@/lib/calculators/salary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

export interface SalaryCalculatorFormProps {
  countryCode?: string;
  countryName?: string;
  currency?: string;
  defaultCountry?: string;
}

export function SalaryCalculatorForm({ countryCode: propCountryCode, countryName: propCountryName, currency: propCurrency, defaultCountry }: SalaryCalculatorFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(propCountryCode || defaultCountry || 'US');
  const countryCode = propCountryCode || selectedCountry;
  const countryName = propCountryName || { US: 'United States', UK: 'United Kingdom', GB: 'United Kingdom', DE: 'Germany', FR: 'France', NL: 'Netherlands' }[countryCode] || countryCode;
  const currency = propCurrency || { US: 'USD', UK: 'GBP', GB: 'GBP', DE: 'EUR', FR: 'EUR', NL: 'EUR' }[countryCode] || 'USD';
  const [grossAnnual, setGrossAnnual] = useState('50000');
  const [payFrequency, setPayFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');
  const [pension, setPension] = useState('0');
  const [bonus, setBonus] = useState('0');
  const [result, setResult] = useState<SalaryResult | null>(null);

  const calculate = () => {
    const gross = parseFloat(grossAnnual);
    if (isNaN(gross) || gross < 0) return;

    const input = {
      grossAnnual: gross,
      countryCode,
      payFrequency: payFrequency as 'monthly',
      pensionContribution: parseFloat(pension) || 0,
      bonus: parseFloat(bonus) || 0,
    };

    let res: SalaryResult;
    switch (countryCode) {
      case 'US':
        res = calculateSalaryUS(input);
        break;
      case 'GB':
        res = calculateSalaryUK(input);
        break;
      default:
        // Generic with approximate brackets
        const configs: Record<string, { brackets: TaxBracket[]; socialRate: number }> = {
          DE: {
            brackets: [
              { min: 0, max: 11604, rate: 0 },
              { min: 11604, max: 17005, rate: 14 },
              { min: 17005, max: 66760, rate: 24 },
              { min: 66760, max: 277825, rate: 42 },
              { min: 277825, max: Infinity, rate: 45 },
            ],
            socialRate: 20.6,
          },
          FR: {
            brackets: [
              { min: 0, max: 11294, rate: 0 },
              { min: 11294, max: 28797, rate: 11 },
              { min: 28797, max: 82341, rate: 30 },
              { min: 82341, max: 177106, rate: 41 },
              { min: 177106, max: Infinity, rate: 45 },
            ],
            socialRate: 22.0,
          },
          NL: {
            brackets: [
              { min: 0, max: 38098, rate: 9.32 },
              { min: 38098, max: 75518, rate: 36.97 },
              { min: 75518, max: Infinity, rate: 49.5 },
            ],
            socialRate: 27.65,
          },
        };
        const config = configs[countryCode] || { brackets: [{ min: 0, max: Infinity, rate: 25 }], socialRate: 10 };
        res = calculateSalaryGeneric(input, { ...config, currency });
        break;
    }

    setResult(res);
  };

  const displayPay = (r: SalaryResult) => {
    switch (payFrequency) {
      case 'monthly': return r.netMonthly;
      case 'biweekly': return r.netBiweekly;
      case 'weekly': return r.netWeekly;
    }
  };

  const resultText = result
    ? `Gross: ${currency} ${formatNumber(result.grossAnnual)} | Net Annual: ${currency} ${formatNumber(result.netAnnual)} | Effective Rate: ${result.effectiveTaxRate}%`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{countryName} Salary Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross">Gross Annual Salary ({currency})</Label>
              <Input
                id="gross"
                type="number"
                value={grossAnnual}
                onChange={(e) => setGrossAnnual(e.target.value)}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Pay Frequency</Label>
              <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as 'monthly')}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pension">Pension Contribution (%)</Label>
              <Input
                id="pension"
                type="number"
                value={pension}
                onChange={(e) => setPension(e.target.value)}
                min="0"
                max="50"
                step="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus">Annual Bonus ({currency})</Label>
              <Input
                id="bonus"
                type="number"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                min="0"
                step="500"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full md:w-auto" size="lg">
            Calculate Take-Home Pay
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Estimated Take-Home Pay</CardTitle>
                <CopyResultsButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Annual</p>
                  <p className="text-xl font-bold">{currency} {formatNumber(result.netAnnual)}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Net {payFrequency}</p>
                  <p className="text-xl font-bold text-primary">{currency} {formatNumber(displayPay(result))}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-xl font-bold">{result.effectiveTaxRate}%</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Marginal Rate</p>
                  <p className="text-xl font-bold">{result.marginalRate}%</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount ({currency})</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.breakdown.map((item, i) => (
                    <TableRow key={i} className={i === result.breakdown.length - 1 ? 'font-bold' : ''}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell className="text-right">
                        {item.amount >= 0 ? '' : '-'}{formatNumber(Math.abs(item.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
