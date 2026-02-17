import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { LoanCalculatorForm } from '@/components/calculators/loan-calculator-form';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { FaqSection, faqJsonLd } from '@/components/seo/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';
import { Disclaimer } from '@/components/shared/disclaimer';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd, webPageJsonLd, softwareApplicationJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Loan & Mortgage Calculator – Monthly Payments & Amortisation | RateWise',
  description:
    'Free loan and mortgage calculator. Calculate monthly payments, total interest, and view a full amortisation schedule. Supports extra payments.',
  alternates: { canonical: '/finance/loan-calculator' },
};

async function getLandingPage() {
  try {
    return await prisma.landingPage.findUnique({
      where: { slug: 'finance/loan-calculator' },
      include: { faqs: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export default async function LoanCalculatorPage() {
  const page = await getLandingPage();
  const siteUrl = getSiteUrl();
  const faqs = page?.faqs || [];

  return (
    <>
      <JsonLd data={webPageJsonLd('Loan & Mortgage Calculator', 'Calculate loan payments and amortisation.', `${siteUrl}/finance/loan-calculator`)} />
      <JsonLd data={softwareApplicationJsonLd('Loan Calculator', 'Calculate monthly payments and total interest for any loan.')} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Finance', href: '/finance' }, { label: 'Loan Calculator' }], siteUrl)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Finance', href: '/finance' }, { label: 'Loan Calculator' }]} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{page?.h1 || 'Loan & Mortgage Calculator'}</h1>
          <SharePageButton />
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {page?.introParagraph || 'Calculate your monthly payment, total interest, and see a full amortisation schedule for any loan or mortgage. Supports extra monthly payments.'}
        </p>

        <AdSlot slot="top-banner" />

        <div className="max-w-4xl">
          <LoanCalculatorForm />

          <AdSlot slot="in-content" />

          <section className="prose prose-slate max-w-none mt-8">
            {page?.howItWorks ? (
              <div dangerouslySetInnerHTML={{ __html: page.howItWorks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            ) : (
              <>
                <h2>How Loan Payments Are Calculated</h2>
                <p>
                  Fixed-rate loan payments are calculated using the amortisation formula:
                  <strong> M = P × [r(1+r)^n] / [(1+r)^n − 1]</strong>, where M is the monthly payment, P is the loan
                  principal, r is the monthly interest rate, and n is the total number of payments.
                </p>
                <h3>Amortisation Schedule</h3>
                <p>
                  Each payment is split between interest and principal. Early payments are mostly interest; as the loan
                  matures, more goes to principal. Our calculator shows this breakdown month by month.
                </p>
                <h3>The Impact of Extra Payments</h3>
                <p>
                  Making extra payments directly reduces the principal balance, which means less interest over the life of
                  the loan and an earlier payoff date. Even small additional payments can save thousands in interest.
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
