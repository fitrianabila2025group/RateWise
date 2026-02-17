'use client';

import { useState } from 'react';
import { calculateSalesTax, type SalesTaxResult } from '@/lib/calculators/sales-tax';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

interface SalesTaxRate {
  stateCode: string;
  stateName: string;
  stateRate: number;
  avgLocalRate: number | null;
  combinedRate: number | null;
}

interface SalesTaxCalculatorFormProps {
  rates: SalesTaxRate[];
  defaultState?: string;
}

export function SalesTaxCalculatorForm({ rates, defaultState }: SalesTaxCalculatorFormProps) {
  const [stateCode, setStateCode] = useState(defaultState || rates[0]?.stateCode || '');
  const [amount, setAmount] = useState('100');
  const [localRate, setLocalRate] = useState('');
  const [result, setResult] = useState<SalesTaxResult | null>(null);

  const selectedRate = rates.find((r) => r.stateCode === stateCode);

  const calculate = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0 || !selectedRate) return;

    const local = localRate ? parseFloat(localRate) : selectedRate.avgLocalRate || 0;

    const res = calculateSalesTax({
      amount: amt,
      stateRate: selectedRate.stateRate,
      localRate: local,
    });
    setResult(res);
  };

  const resultText = result
    ? `Subtotal: $${formatNumber(result.subtotal)} | Tax: $${formatNumber(result.totalTax)} (${result.effectiveRate}%) | Total: $${formatNumber(result.total)}`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Sales Tax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={stateCode} onValueChange={setStateCode}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((r) => (
                    <SelectItem key={r.stateCode} value={r.stateCode}>
                      {r.stateName} ({r.stateRate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Purchase Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localRate">Local Tax Rate (%) — optional</Label>
              <Input
                id="localRate"
                type="number"
                value={localRate}
                onChange={(e) => setLocalRate(e.target.value)}
                placeholder={`Default avg: ${selectedRate?.avgLocalRate || 0}%`}
                min="0"
                max="15"
                step="0.01"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full md:w-auto" size="lg">
            Calculate
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Results</CardTitle>
              <CopyResultsButton text={resultText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-xl font-bold">${formatNumber(result.subtotal)}</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">State Tax</p>
                <p className="text-xl font-bold">${formatNumber(result.stateTax)}</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Local Tax</p>
                <p className="text-xl font-bold">${formatNumber(result.localTax)}</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">${formatNumber(result.total)}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Effective tax rate: {result.effectiveRate}%
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
