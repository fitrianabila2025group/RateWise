import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { VatCalculatorForm } from '@/components/calculators/vat-calculator-form';
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
  params: Promise<{ country: string }>;
}

async function getVatData(countrySlug: string) {
  try {
    const rates = await prisma.vatRate.findMany({ orderBy: { countryName: 'asc' } });
    const rate = rates.find(
      (r) => r.countryName.toLowerCase().replace(/\s+/g, '-') === countrySlug,
    );
    return { rate, allRates: rates };
  } catch {
    return { rate: null, allRates: [] };
  }
}

async function getLandingPage(countrySlug: string) {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: `vat/${countrySlug}` },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const { rate } = await getVatData(country);
  const page = await getLandingPage(country);

  if (!rate) return {};

  const title = page?.title || `${rate.countryName} VAT Calculator – ${rate.standardRate}% Rate`;
  const description = page?.metaDescription || `Free ${rate.countryName} VAT calculator. Standard rate: ${rate.standardRate}%.`;

  return {
    title,
    description,
    alternates: { canonical: `/vat/${country}` },
    openGraph: { title, description, url: `/vat/${country}` },
    twitter: { title, description },
  };
}

export async function generateStaticParams() {
  try {
    const rates = await prisma.vatRate.findMany({ select: { countryName: true } });
    return rates.map((r) => ({
      country: r.countryName.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch {
    return [];
  }
}

export default async function VatCountryPage({ params }: PageProps) {
  const { country } = await params;
  const { rate, allRates } = await getVatData(country);
  const page = await getLandingPage(country);

  if (!rate) notFound();

  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd(page?.title || `${rate.countryName} VAT Calculator`, page?.metaDescription || '', `${siteUrl}/vat/${country}`)} />
      <JsonLd data={softwareApplicationJsonLd(`${rate.countryName} VAT Calculator`, `Calculate VAT at ${rate.standardRate}%`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'VAT Calculator', href: '/vat' }, { label: rate.countryName }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'VAT Calculator', href: '/vat' }, { label: rate.countryName }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {page?.h1 || `${rate.countryName} VAT Calculator`}
          </h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || `Calculate VAT for ${rate.countryName} at the standard rate of ${rate.standardRate}%.`}
        </p>

        <AdSlot slot="top-banner" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VatCalculatorForm
              rates={allRates.map((r) => ({
                countryCode: r.countryCode,
                countryName: r.countryName,
                standardRate: r.standardRate,
                reducedRate: r.reducedRate,
              }))}
              defaultCountry={rate.countryCode}
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

            {page?.commonMistakes && (
              <div className="mt-6 prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.commonMistakes.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            )}

            <FaqSection faqs={faqs} />

            <Disclaimer />
          </div>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{rate.countryName} VAT Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between"><span>Standard Rate</span><Badge>{rate.standardRate}%</Badge></div>
                {rate.reducedRate && <div className="flex justify-between"><span>Reduced Rate</span><Badge variant="secondary">{rate.reducedRate}%</Badge></div>}
                {rate.superReduced && <div className="flex justify-between"><span>Super Reduced</span><Badge variant="secondary">{rate.superReduced}%</Badge></div>}
                {rate.parkingRate && <div className="flex justify-between"><span>Parking Rate</span><Badge variant="secondary">{rate.parkingRate}%</Badge></div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other EU Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {allRates
                    .filter((r) => r.countryCode !== rate.countryCode)
                    .slice(0, 10)
                    .map((r) => (
                      <Link
                        key={r.countryCode}
                        href={`/vat/${r.countryName.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between py-1 text-sm hover:text-primary transition-colors"
                      >
                        <span>{r.countryName}</span>
                        <span className="text-muted-foreground">{r.standardRate}%</span>
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
