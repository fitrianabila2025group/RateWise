import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { VatCalculatorForm } from '@/components/calculators/vat-calculator-form';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Disclaimer } from '@/components/shared/disclaimer';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

// Force dynamic rendering so rates are always fetched from the DB
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'EU VAT Calculator – Calculate VAT for All EU Countries',
  description:
    'Free EU VAT calculator covering all 27 member states. Add or remove VAT at current rates. Updated for 2026.',
  alternates: { canonical: '/vat' },
  openGraph: {
    title: 'EU VAT Calculator – Calculate VAT for All EU Countries',
    description: 'Free EU VAT calculator covering all 27 member states.',
    url: '/vat',
  },
};

async function getVatRates() {
  try {
    return await prisma.vatRate.findMany({ orderBy: { countryName: 'asc' } });
  } catch {
    return [];
  }
}

export default async function VatPage() {
  const rates = await getVatRates();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={webPageJsonLd('EU VAT Calculator', 'Free EU VAT calculator covering all 27 member states.', `${siteUrl}/vat`)} />
      <JsonLd data={softwareApplicationJsonLd('EU VAT Calculator', 'Calculate VAT for all EU countries')} />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'VAT Calculator' }]} />

        <h1 className="text-3xl md:text-4xl font-bold mb-4">EU VAT Calculator</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Calculate Value Added Tax for all 27 EU member states. Add VAT to a net amount or remove VAT
          from a gross amount. Select your country to use the current standard rate, or enter a custom
          rate.
        </p>

        <AdSlot slot="top-banner" />

        {rates.length === 0 && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠️ VAT rates not loaded. The database may not be seeded yet.
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Run <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">npx tsx prisma/seed.ts</code> or check your DATABASE_URL environment variable.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VatCalculatorForm
              rates={rates.map((r) => ({
                countryCode: r.countryCode,
                countryName: r.countryName,
                standardRate: r.standardRate,
                reducedRate: r.reducedRate,
              }))}
            />

            <AdSlot slot="in-content" />

            <div className="mt-8 prose prose-slate max-w-none">
              <h2>How VAT Works in the EU</h2>
              <p>
                Value Added Tax (VAT) is a consumption tax applied to goods and services in the European
                Union. Each EU member state sets its own standard VAT rate, which must be at least 15%.
                Most countries also have reduced rates for essential items like food, books, and
                medications.
              </p>
              <h3>How to Use This Calculator</h3>
              <ol>
                <li>Select the EU country from the dropdown</li>
                <li>Enter the amount you want to calculate</li>
                <li>Choose whether the amount includes or excludes VAT</li>
                <li>Optionally override the VAT rate</li>
                <li>Click &quot;Calculate&quot; to see the results</li>
              </ol>
            </div>

            <Disclaimer />
          </div>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EU VAT Rates by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rates.map((r) => (
                    <Link
                      key={r.countryCode}
                      href={`/vat/${r.countryName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted transition-colors text-sm"
                    >
                      <span>{r.countryName}</span>
                      <Badge variant="secondary">{r.standardRate}%</Badge>
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
