import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdSlot } from '@/components/layout/ad-slot';
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  Landmark,
  Flame,
  ArrowRightLeft,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'RateWise – Free VAT, Sales Tax, Salary & Finance Calculators',
  description:
    'Free, accurate online calculators for EU VAT, US sales tax, salary take-home pay, compound interest, loan amortization, and FIRE planning. Mobile-friendly and updated for 2026.',
  alternates: { canonical: '/' },
};

const categories = [
  {
    title: 'VAT Calculator',
    description: 'Calculate Value Added Tax for all EU countries. Add or remove VAT instantly.',
    href: '/vat',
    icon: Percent,
    badge: 'EU',
    color: 'text-blue-600',
  },
  {
    title: 'Sales Tax Calculator',
    description: 'Calculate sales tax for all 50 US states. Includes state and local rates.',
    href: '/sales-tax',
    icon: DollarSign,
    badge: 'USA',
    color: 'text-green-600',
  },
  {
    title: 'Salary Calculator',
    description: 'Estimate your take-home pay from gross salary. Supports US, UK, Germany, France, Netherlands.',
    href: '/salary',
    icon: Calculator,
    badge: 'Multi-country',
    color: 'text-purple-600',
  },
  {
    title: 'Compound Interest',
    description: 'See how your investments grow with compound interest over time.',
    href: '/finance/compound-interest',
    icon: TrendingUp,
    badge: 'Finance',
    color: 'text-orange-600',
  },
  {
    title: 'Loan & Mortgage',
    description: 'Calculate monthly payments with a full amortization schedule.',
    href: '/finance/loan-calculator',
    icon: Landmark,
    badge: 'Finance',
    color: 'text-teal-600',
  },
  {
    title: 'FIRE Calculator',
    description: 'Calculate your Financial Independence number and years to retire early.',
    href: '/finance/fire',
    icon: Flame,
    badge: 'Finance',
    color: 'text-red-600',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Free Financial Calculators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Accurate VAT, sales tax, salary, and investment calculators for professionals across the
            United States and Europe. No sign-up required.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">EU VAT Rates</Badge>
            <Badge variant="secondary">US Sales Tax</Badge>
            <Badge variant="secondary">Salary Calculator</Badge>
            <Badge variant="secondary">Compound Interest</Badge>
            <Badge variant="secondary">Loan Amortization</Badge>
            <Badge variant="secondary">FIRE Planning</Badge>
          </div>
        </div>
      </section>

      <AdSlot slot="top-banner" />

      {/* Calculator Grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Choose a Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <cat.icon className={`h-8 w-8 ${cat.color}`} />
                    <Badge variant="outline">{cat.badge}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {cat.title}
                  </CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slot="in-content" />

      {/* SEO Content */}
      <section className="container py-12 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">About RateWise</h2>
        <div className="prose prose-slate max-w-none">
          <p>
            RateWise provides free, accurate financial calculators designed for professionals, business
            owners, freelancers, and individuals across the United States and Europe. Whether you need to
            calculate VAT for an EU invoice, determine sales tax in any US state, estimate your take-home
            salary, or plan your financial independence, our tools deliver instant, reliable results.
          </p>
          <h3>Why Use RateWise?</h3>
          <ul>
            <li>
              <strong>Always Up-to-Date:</strong> Our tax rates and brackets are regularly updated to
              reflect the latest changes in legislation.
            </li>
            <li>
              <strong>No Sign-Up Required:</strong> All calculators are free to use without creating an
              account.
            </li>
            <li>
              <strong>Mobile-Friendly:</strong> Every calculator works perfectly on phones, tablets, and
              desktops.
            </li>
            <li>
              <strong>Transparent Formulas:</strong> We show you exactly how each calculation works so you
              can verify the results.
            </li>
            <li>
              <strong>Privacy-First:</strong> We don&apos;t track your inputs or store your financial data.
            </li>
          </ul>
          <h3>Our Calculators</h3>
          <p>
            From EU VAT calculations across 27 member states to US sales tax rates for all 50 states, from
            gross-to-net salary conversions in 5 countries to compound interest projections and FIRE
            planning — RateWise has the tools you need to make informed financial decisions.
          </p>
        </div>
      </section>

      <AdSlot slot="footer" />
    </>
  );
}
