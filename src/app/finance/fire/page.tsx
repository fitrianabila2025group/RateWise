import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { FireCalculatorForm } from '@/components/calculators/fire-calculator-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { FaqSection, faqJsonLd } from '@/components/seo/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FIRE Calculator – Financial Independence, Retire Early | RateWise',
  description:
    'Calculate your FIRE number and how many years until you can retire early. See Lean, Fat, and Coast FIRE targets with year-by-year projections.',
  alternates: { canonical: '/finance/fire' },
};

async function getLandingPage() {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: 'finance/fire' },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export default async function FirePage() {
  const page = await getLandingPage();
  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd('FIRE Calculator', 'Calculate your path to financial independence.', `${siteUrl}/finance/fire`)} />
      <JsonLd data={softwareApplicationJsonLd('FIRE Calculator', 'Calculate your Financial Independence / Retire Early number.')} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Finance', href: '/finance' }, { label: 'FIRE Calculator' }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Finance', href: '/finance' }, { label: 'FIRE Calculator' }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{page?.h1 || 'FIRE Calculator'}</h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || 'Calculate your Financial Independence / Retire Early (FIRE) number, years to FIRE, and explore Lean, Fat, and Coast FIRE variants with year-by-year projections.'}
        </p>

        <AdSlot slot="top-banner" />

        <div className="max-w-4xl">
          <FireCalculatorForm />

          <AdSlot slot="in-content" />

          <section className="prose prose-slate max-w-none mt-8">
            {page?.howItWorks ? (
              <div dangerouslySetInnerHTML={{ __html: page.howItWorks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            ) : (
              <>
                <h2>What Is FIRE?</h2>
                <p>
                  FIRE stands for <strong>Financial Independence, Retire Early</strong>. The core idea is to save and
                  invest aggressively so that your investment portfolio generates enough passive income to cover your
                  living expenses – freeing you from the need to work for money.
                </p>
                <h3>The 4% Rule</h3>
                <p>
                  The standard FIRE calculation uses the 4% safe withdrawal rate: your FIRE number is 25× your annual
                  expenses. This means you can safely withdraw 4% of your portfolio each year without running out of
                  money over a 30-year retirement (based on the Trinity Study).
                </p>
                <h3>Types of FIRE</h3>
                <ul>
                  <li><strong>Lean FIRE</strong> – Bare minimum expenses, typically 50–70% of current spending.</li>
                  <li><strong>Regular FIRE</strong> – Maintaining your current lifestyle in retirement.</li>
                  <li><strong>Fat FIRE</strong> – A more comfortable retirement with 120–150% of current expenses.</li>
                  <li><strong>Coast FIRE</strong> – Enough saved that compound growth alone will reach your FIRE number by traditional retirement age, so you only need to cover current expenses.</li>
                </ul>
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
