import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Financial Calculators – Compound Interest, Loan & FIRE | RateWise',
  description:
    'Free financial calculators for compound interest, loan/mortgage payments, and financial independence (FIRE). Plan your savings, investments and retirement.',
  alternates: { canonical: '/finance' },
};

const calculators = [
  {
    title: 'Compound Interest Calculator',
    description: 'Calculate how your money grows over time with compound interest. See yearly breakdowns, contributions and total interest earned.',
    href: '/finance/compound-interest',
    badge: 'Investing',
  },
  {
    title: 'Loan / Mortgage Calculator',
    description: 'Calculate monthly payments, total interest, and view a full amortization schedule for any loan or mortgage.',
    href: '/finance/loan-calculator',
    badge: 'Debt',
  },
  {
    title: 'FIRE Calculator',
    description: 'Calculate your Financial Independence / Retire Early number. See Lean, Fat, and Coast FIRE targets plus year-by-year projections.',
    href: '/finance/fire',
    badge: 'Retirement',
  },
];

export default function FinanceOverviewPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={webPageJsonLd('Financial Calculators', 'Free compound interest, loan and FIRE calculators.', `${siteUrl}/finance`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Finance' }], siteUrl)} />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Finance' }]} />

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Financial Calculators</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Plan your financial future with our free tools. Whether you're saving, investing, paying off debt, or working
          toward early retirement – we've got you covered.
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {calculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{calc.badge}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{calc.title}</CardTitle>
                  <CardDescription>{calc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary">Open Calculator →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <AdSlot slot="in-content" />

        <section className="prose prose-slate max-w-none mt-8">
          <h2>Why Financial Planning Matters</h2>
          <p>
            Understanding compound interest, managing loans effectively, and having a clear retirement plan are
            fundamental to achieving financial freedom. Our calculators help you model different scenarios so you can
            make informed decisions about your money.
          </p>
          <h3>The Power of Compound Interest</h3>
          <p>
            Albert Einstein reportedly called compound interest the "eighth wonder of the world." When your investment
            earnings generate their own earnings, growth accelerates exponentially over time. Even small regular
            contributions can grow to significant amounts over decades.
          </p>
          <h3>Understanding Loan Amortisation</h3>
          <p>
            Whether it's a mortgage, car loan, or personal loan, understanding how your payments are split between
            principal and interest helps you make smarter borrowing decisions and find opportunities to save money
            through extra payments.
          </p>
          <h3>The FIRE Movement</h3>
          <p>
            Financial Independence, Retire Early (FIRE) is a movement focused on extreme savings and investment strategies
            to allow you to retire much earlier than traditional budgets would allow. Our FIRE calculator helps you
            estimate how long it will take to reach financial independence based on your current savings rate and
            investment returns.
          </p>
        </section>
      </div>
    </>
  );
}
