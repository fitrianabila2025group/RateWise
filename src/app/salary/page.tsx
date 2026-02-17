import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SalaryCalculatorForm } from '@/components/calculators/salary-calculator-form';
import { HourlySalaryForm } from '@/components/calculators/hourly-salary-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Salary Calculators – Net Pay, Tax & Hourly↔Salary | RateWise',
  description:
    'Free salary calculators for the US, UK, Germany, France & Netherlands. Calculate net pay after taxes, convert hourly to salary and more.',
  alternates: { canonical: '/salary' },
};

async function getCountries() {
  try {
    return await prisma.salaryConfig.findMany({ orderBy: { countryCode: 'asc' } });
  } catch {
    return [];
  }
}

const countryNames: Record<string, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
};

export default async function SalaryOverviewPage() {
  const countries = await getCountries();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={webPageJsonLd('Salary Calculators', 'Free salary calculators for net pay and tax.', `${siteUrl}/salary`)} />
      <JsonLd data={softwareApplicationJsonLd('RateWise Salary Calculator', 'Calculate net salary after taxes.')} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Salary' }], siteUrl)} />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Salary' }]} />

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Salary &amp; Income Calculators</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Calculate your net take‑home pay, understand tax brackets, and convert between hourly and annual salary across
          multiple countries.
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SalaryCalculatorForm />
            <HourlySalaryForm />
            <AdSlot slot="in-content" />

            <section className="prose prose-slate max-w-none">
              <h2>Understanding Salary Tax Calculations</h2>
              <p>
                Salary tax calculations vary significantly between countries. Each country has its own income tax brackets,
                social security contributions, and deductions. Our calculators model the progressive tax systems used by each
                supported country to give you an accurate estimate of your net take-home pay.
              </p>
              <h3>How Progressive Tax Works</h3>
              <p>
                In a progressive tax system, your income is divided into "brackets." Each bracket is taxed at a different
                rate. Only the income within each bracket is taxed at that bracket's rate – not your entire income.
              </p>
              <h3>Hourly to Salary Conversion</h3>
              <p>
                Converting an hourly rate to an annual salary depends on how many hours you work per week and how many weeks
                per year. A standard assumption is 40 hours/week for 52 weeks (2,080 hours). Our calculator also supports
                overtime rates and custom hours.
              </p>
            </section>

            <Disclaimer />
          </div>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Country Calculators</CardTitle>
                <CardDescription>Detailed salary calculators by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countries.map((c) => (
                    <Link
                      key={c.countryCode}
                      href={`/salary/${c.countryCode.toLowerCase()}`}
                      className="flex items-center justify-between py-2 px-2 rounded hover:bg-accent transition-colors"
                    >
                      <span className="font-medium">{countryNames[c.countryCode] || c.countryCode}</span>
                      <Badge variant="secondary">Calculator →</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Calculators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/finance/compound-interest" className="block text-sm hover:text-primary transition-colors">
                    Compound Interest Calculator
                  </Link>
                  <Link href="/finance/fire" className="block text-sm hover:text-primary transition-colors">
                    FIRE Calculator
                  </Link>
                  <Link href="/finance/loan-calculator" className="block text-sm hover:text-primary transition-colors">
                    Loan / Mortgage Calculator
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
