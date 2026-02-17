import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SalesTaxCalculatorForm } from '@/components/calculators/sales-tax-calculator-form';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Disclaimer } from '@/components/shared/disclaimer';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'US Sales Tax Calculator – All 50 States',
  description:
    'Free US sales tax calculator covering all 50 states. Includes state and local tax rates. Fast, accurate, updated for 2026.',
  alternates: { canonical: '/sales-tax' },
};

async function getRates() {
  try {
    return await prisma.salesTaxRate.findMany({ orderBy: { stateName: 'asc' } });
  } catch {
    return [];
  }
}

export default async function SalesTaxPage() {
  const rates = await getRates();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={webPageJsonLd('US Sales Tax Calculator', 'Free US sales tax calculator covering all 50 states.', `${siteUrl}/sales-tax`)} />
      <JsonLd data={softwareApplicationJsonLd('US Sales Tax Calculator', 'Calculate sales tax for any US state')} />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Sales Tax Calculator' }]} />

        <h1 className="text-3xl md:text-4xl font-bold mb-4">US Sales Tax Calculator</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Calculate sales tax for any US state. Our calculator includes both state and average local tax
          rates. Select your state, enter the purchase amount, and get an instant tax calculation.
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SalesTaxCalculatorForm
              rates={rates.map((r) => ({
                stateCode: r.stateCode,
                stateName: r.stateName,
                stateRate: r.stateRate,
                avgLocalRate: r.avgLocalRate,
                combinedRate: r.combinedRate,
              }))}
            />

            <AdSlot slot="in-content" />

            <div className="mt-8 prose prose-slate max-w-none">
              <h2>Understanding US Sales Tax</h2>
              <p>
                Sales tax in the United States varies by state and locality. Unlike the EU&apos;s VAT system,
                US sales tax is applied only at the point of sale to the end consumer. States set their
                own base rates, and counties, cities, and special districts can add additional taxes.
              </p>
              <h3>States with No Sales Tax</h3>
              <p>
                Five states have no state-level sales tax: Alaska, Delaware, Montana, New Hampshire, and
                Oregon. However, Alaska allows local jurisdictions to impose sales taxes.
              </p>
            </div>

            <Disclaimer />
          </div>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sales Tax by State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-auto">
                  {rates.map((r) => (
                    <Link
                      key={r.stateCode}
                      href={`/sales-tax/${r.stateName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted transition-colors text-sm"
                    >
                      <span>{r.stateName}</span>
                      <Badge variant="secondary">{r.stateRate}%</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
