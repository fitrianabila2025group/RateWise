'use client';

import { useState } from 'react';
import { convertHourlyToSalary, convertSalaryToHourly, type HourlySalaryResult } from '@/lib/calculators/hourly-salary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyResultsButton } from '@/components/shared/action-buttons';
import { formatNumber } from '@/lib/utils';

export function HourlySalaryForm() {
  const [hourlyRate, setHourlyRate] = useState('25');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [hasOvertime, setHasOvertime] = useState(false);
  const [annualSalary, setAnnualSalary] = useState('52000');
  const [result, setResult] = useState<HourlySalaryResult | null>(null);
  const [hourlyResult, setHourlyResult] = useState<number | null>(null);

  const calculateToSalary = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);
    if (isNaN(rate) || isNaN(hours) || isNaN(weeks)) return;

    const res = convertHourlyToSalary({
      hourlyRate: rate,
      hoursPerWeek: hours,
      weeksPerYear: weeks,
      overtimeHours: hasOvertime ? parseFloat(overtimeHours) || 0 : 0,
    });
    setResult(res);
  };

  const calculateToHourly = () => {
    const salary = parseFloat(annualSalary);
    if (isNaN(salary)) return;
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;
    setHourlyResult(convertSalaryToHourly(salary, hours, weeks));
  };

  return (
    <Tabs defaultValue="to-salary" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="to-salary">Hourly → Salary</TabsTrigger>
        <TabsTrigger value="to-hourly">Salary → Hourly</TabsTrigger>
      </TabsList>

      <TabsContent value="to-salary">
        <Card>
          <CardHeader>
            <CardTitle>Convert Hourly Rate to Annual Salary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourly">Hourly Rate ($)</Label>
                <Input id="hourly" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} min="0" step="0.50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours per Week</Label>
                <Input id="hours" type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} min="0" max="168" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeks">Weeks per Year</Label>
                <Input id="weeks" type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} min="0" max="52" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch id="overtime" checked={hasOvertime} onCheckedChange={setHasOvertime} />
                  <Label htmlFor="overtime">Include Overtime</Label>
                </div>
                {hasOvertime && (
                  <Input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} placeholder="OT hours/week" min="0" />
                )}
              </div>
            </div>
            <Button onClick={calculateToSalary} size="lg">Convert</Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results</CardTitle>
                <CopyResultsButton text={`Annual: $${formatNumber(result.annualPay)} | Monthly: $${formatNumber(result.monthlyPay)} | Weekly: $${formatNumber(result.weeklyPay)}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Annual</p>
                  <p className="text-xl font-bold">${formatNumber(result.annualPay)}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <p className="text-xl font-bold">${formatNumber(result.monthlyPay)}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Bi-weekly</p>
                  <p className="text-xl font-bold">${formatNumber(result.biweeklyPay)}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Weekly</p>
                  <p className="text-xl font-bold">${formatNumber(result.weeklyPay)}</p>
                </div>
              </div>
              {result.overtimePay > 0 && (
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Includes ${formatNumber(result.overtimePay)} in annual overtime pay (1.5× rate)
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="to-hourly">
        <Card>
          <CardHeader>
            <CardTitle>Convert Annual Salary to Hourly Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary ($)</Label>
                <Input id="salary" type="number" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} min="0" step="1000" />
              </div>
              <div className="space-y-2">
                <Label>Hours/Week</Label>
                <Input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} min="0" max="168" />
              </div>
              <div className="space-y-2">
                <Label>Weeks/Year</Label>
                <Input type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} min="0" max="52" />
              </div>
            </div>
            <Button onClick={calculateToHourly} size="lg">Convert</Button>
          </CardContent>
        </Card>

        {hourlyResult !== null && (
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Equivalent Hourly Rate</p>
                <p className="text-4xl font-bold text-primary">${formatNumber(hourlyResult)}/hr</p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
