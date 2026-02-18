import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SalesTaxCalculatorForm } from '@/components/calculators/sales-tax-calculator-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { FaqSection, faqJsonLd } from '@/components/seo/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ state: string }>;
}

async function getData(stateSlug: string) {
  try {
    const rates = await prisma.salesTaxRate.findMany({ orderBy: { stateName: 'asc' } });
    const rate = rates.find(
      (r) => r.stateName.toLowerCase().replace(/\s+/g, '-') === stateSlug,
    );
    return { rate, allRates: rates };
  } catch {
    return { rate: null, allRates: [] };
  }
}

async function getLandingPage(stateSlug: string) {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: `sales-tax/${stateSlug}` },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const { rate } = await getData(state);
  const page = await getLandingPage(state);
  if (!rate) return {};

  const title = page?.title || `${rate.stateName} Sales Tax Calculator – ${rate.stateRate}%`;
  const description = page?.metaDescription || `Calculate sales tax for ${rate.stateName}.`;

  return {
    title,
    description,
    alternates: { canonical: `/sales-tax/${state}` },
    openGraph: { title, description, url: `/sales-tax/${state}` },
  };
}

export async function generateStaticParams() {
  try {
    const rates = await prisma.salesTaxRate.findMany({ select: { stateName: true } });
    return rates.map((r) => ({ state: r.stateName.toLowerCase().replace(/\s+/g, '-') }));
  } catch {
    return [];
  }
}

export default async function SalesTaxStatePage({ params }: PageProps) {
  const { state } = await params;
  const { rate, allRates } = await getData(state);
  const page = await getLandingPage(state);

  if (!rate) notFound();

  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd(page?.title || `${rate.stateName} Sales Tax Calculator`, page?.metaDescription || '', `${siteUrl}/sales-tax/${state}`)} />
      <JsonLd data={softwareApplicationJsonLd(`${rate.stateName} Sales Tax Calculator`, `Calculate sales tax at ${rate.stateRate}%`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Sales Tax', href: '/sales-tax' }, { label: rate.stateName }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Sales Tax', href: '/sales-tax' }, { label: rate.stateName }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{page?.h1 || `${rate.stateName} Sales Tax Calculator`}</h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || `Calculate sales tax for ${rate.stateName}. State rate: ${rate.stateRate}%.`}
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SalesTaxCalculatorForm
              rates={allRates.map((r) => ({
                stateCode: r.stateCode,
                stateName: r.stateName,
                stateRate: r.stateRate,
                avgLocalRate: r.avgLocalRate,
                combinedRate: r.combinedRate,
              }))}
              defaultState={rate.stateCode}
            />

            <AdSlot slot="in-content" />

            {page?.howItWorks && (
              <div className="mt-8 prose prose-slate max-w-none">
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
                <CardTitle className="text-lg">{rate.stateName} Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between"><span>State Rate</span><Badge>{rate.stateRate}%</Badge></div>
                {rate.avgLocalRate !== null && <div className="flex justify-between"><span>Avg Local Rate</span><Badge variant="secondary">{rate.avgLocalRate}%</Badge></div>}
                {rate.combinedRate !== null && <div className="flex justify-between"><span>Combined Rate</span><Badge variant="outline">{rate.combinedRate}%</Badge></div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-64 overflow-auto">
                  {allRates
                    .filter((r) => r.stateCode !== rate.stateCode)
                    .slice(0, 15)
                    .map((r) => (
                      <Link
                        key={r.stateCode}
                        href={`/sales-tax/${r.stateName.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between py-1 text-sm hover:text-primary transition-colors"
                      >
                        <span>{r.stateName}</span>
                        <span className="text-muted-foreground">{r.stateRate}%</span>
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
