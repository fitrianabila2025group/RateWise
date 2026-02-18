import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SalaryCalculatorForm } from '@/components/calculators/salary-calculator-form';
import { HourlySalaryForm } from '@/components/calculators/hourly-salary-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { FaqSection, faqJsonLd } from '@/components/seo/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ country: string }>;
}

const countryMap: Record<string, string> = {
  us: 'US',
  uk: 'UK',
  de: 'DE',
  fr: 'FR',
  nl: 'NL',
};

const countryNames: Record<string, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
};

async function getData(countrySlug: string) {
  const code = countryMap[countrySlug];
  if (!code) return null;
  try {
    const config = await prisma.salaryConfig.findUnique({ where: { countryCode: code } });
    return config ? { config, code } : null;
  } catch {
    return null;
  }
}

async function getLandingPage(countrySlug: string) {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: `salary/${countrySlug}` },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const data = await getData(country);
  const page = await getLandingPage(country);
  if (!data) return {};
  const name = countryNames[data.code] || data.code;
  const title = page?.title || `${name} Salary Calculator – Net Pay After Tax | RateWise`;
  const description = page?.metaDescription || `Calculate your net salary in ${name} after income tax and social contributions.`;

  return {
    title,
    description,
    alternates: { canonical: `/salary/${country}` },
    openGraph: { title, description, url: `/salary/${country}` },
  };
}

export async function generateStaticParams() {
  return Object.keys(countryMap).map((slug) => ({ country: slug }));
}

export default async function SalaryCountryPage({ params }: PageProps) {
  const { country } = await params;
  const data = await getData(country);
  const page = await getLandingPage(country);

  if (!data) notFound();

  const { code } = data;
  const name = countryNames[code] || code;
  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd(page?.title || `${name} Salary Calculator`, page?.metaDescription || '', `${siteUrl}/salary/${country}`)} />
      <JsonLd data={softwareApplicationJsonLd(`${name} Salary Calculator`, `Calculate net pay in ${name}.`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Salary', href: '/salary' }, { label: name }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Salary', href: '/salary' }, { label: name }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{page?.h1 || `${name} Salary Calculator`}</h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || `Calculate your net take-home pay in ${name} after income tax and social contributions.`}
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SalaryCalculatorForm defaultCountry={code} />
            <HourlySalaryForm />

            <AdSlot slot="in-content" />

            {page?.howItWorks && (
              <div className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.howItWorks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            )}

            {page?.examples && (
              <div className="mt-6 prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.examples.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            )}

            <FaqSection faqs={faqs} />
            <Disclaimer />
          </div>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(countryMap)
                    .filter(([slug]) => slug !== country)
                    .map(([slug, c]) => (
                      <Link
                        key={c}
                        href={`/salary/${slug}`}
                        className="flex items-center justify-between py-1 text-sm hover:text-primary transition-colors"
                      >
                        <span>{countryNames[c] || c}</span>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Link href="/finance/compound-interest" className="block hover:text-primary">Compound Interest</Link>
                <Link href="/finance/fire" className="block hover:text-primary">FIRE Calculator</Link>
                <Link href="/finance/loan-calculator" className="block hover:text-primary">Loan Calculator</Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
