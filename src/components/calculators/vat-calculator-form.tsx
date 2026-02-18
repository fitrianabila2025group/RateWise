'use client';

import { useState } from 'react';
import { calculateVat, type VatResult } from '@/lib/calculators/vat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

interface VatRate {
  countryCode: string;
  countryName: string;
  standardRate: number;
  reducedRate: number | null;
}

interface VatCalculatorFormProps {
  rates: VatRate[];
  defaultCountry?: string;
}

export function VatCalculatorForm({ rates, defaultCountry }: VatCalculatorFormProps) {
  const [country, setCountry] = useState(defaultCountry || rates[0]?.countryCode || '');
  const [amount, setAmount] = useState('1000');
  const [customRate, setCustomRate] = useState('');
  const [inclusive, setInclusive] = useState(false);
  const [result, setResult] = useState<VatResult | null>(null);

  const selectedRate = rates.find((r) => r.countryCode === country);
  const activeRate = customRate ? parseFloat(customRate) : selectedRate?.standardRate || 0;

  const calculate = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) return;

    const res = calculateVat({
      amount: amt,
      rate: activeRate,
      inclusive,
    });
    setResult(res);
  };

  const resultText = result
    ? `Net: ${formatNumber(result.netAmount)} | VAT (${result.rate}%): ${formatNumber(result.vatAmount)} | Gross: ${formatNumber(result.grossAmount)}`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate VAT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((r) => (
                    <SelectItem key={r.countryCode} value={r.countryCode}>
                      {r.countryName} ({r.standardRate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
              <Label htmlFor="customRate">Custom VAT Rate (%) — optional</Label>
              <Input
                id="customRate"
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder={`Default: ${activeRate}%`}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch id="inclusive" checked={inclusive} onCheckedChange={setInclusive} />
              <Label htmlFor="inclusive">
                {inclusive ? 'Amount includes VAT (gross)' : 'Amount excludes VAT (net)'}
              </Label>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                <p className="text-xs sm:text-sm text-muted-foreground">Net Amount</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums truncate">{formatNumber(result.netAmount)}</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                <p className="text-xs sm:text-sm text-muted-foreground">VAT ({result.rate}%)</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary tabular-nums truncate">{formatNumber(result.vatAmount)}</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-background rounded-lg overflow-hidden">
                <p className="text-xs sm:text-sm text-muted-foreground">Gross Amount</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums truncate">{formatNumber(result.grossAmount)}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-background rounded-lg text-sm">
              <p className="font-medium mb-1">Formula Used:</p>
              {inclusive ? (
                <p className="text-muted-foreground">
                  Net = Gross ÷ (1 + {result.rate}÷100) = {formatNumber(result.grossAmount)} ÷{' '}
                  {(1 + result.rate / 100).toFixed(4)} = {formatNumber(result.netAmount)}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  VAT = Net × ({result.rate}÷100) = {formatNumber(result.netAmount)} × {result.rate / 100} ={' '}
                  {formatNumber(result.vatAmount)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
