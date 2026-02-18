import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { CompoundInterestForm } from '@/components/calculators/compound-interest-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { FaqSection, faqJsonLd } from '@/components/seo/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator – Growth, Contributions & Yearly Breakdown | RateWise',
  description:
    'Free compound interest calculator with daily, monthly, quarterly and annual compounding. See how your savings grow over time with regular contributions.',
  alternates: { canonical: '/finance/compound-interest' },
};

async function getLandingPage() {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: 'finance/compound-interest' },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export default async function CompoundInterestPage() {
  const page = await getLandingPage();
  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd('Compound Interest Calculator', 'Calculate compound interest with regular contributions.', `${siteUrl}/finance/compound-interest`)} />
      <JsonLd data={softwareApplicationJsonLd('Compound Interest Calculator', 'Calculate how money grows with compound interest.')} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Finance', href: '/finance' }, { label: 'Compound Interest' }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Finance', href: '/finance' }, { label: 'Compound Interest' }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{page?.h1 || 'Compound Interest Calculator'}</h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || 'Calculate how your savings grow over time with the power of compound interest. Supports daily, monthly, quarterly, and annual compounding with regular contributions.'}
        </p>

        <AdSlot slot="top-banner" />

        <div className="max-w-4xl">
          <CompoundInterestForm />

          <AdSlot slot="in-content" />

          <section className="prose prose-slate max-w-none mt-8">
            {page?.howItWorks ? (
              <div dangerouslySetInnerHTML={{ __html: page.howItWorks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            ) : (
              <>
                <h2>How Compound Interest Works</h2>
                <p>
                  Compound interest is interest calculated on the initial principal and also on the accumulated interest of
                  previous periods. The formula is: <strong>A = P(1 + r/n)^(nt)</strong> where P is the principal, r is the
                  annual interest rate, n is the number of times interest is compounded per year, and t is the time in years.
                </p>
                <h3>The Rule of 72</h3>
                <p>
                  A quick way to estimate how long it takes for your money to double: divide 72 by your interest rate. At 6%
                  annual return, your money doubles roughly every 12 years.
                </p>
              </>
            )}
          </section>

          <FaqSection faqs={faqs} />
          <Disclaimer />
        </div>
      </div>
    </>
  );
}
