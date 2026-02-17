import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'About RateWise – Free Online Calculators',
  description: 'Learn about RateWise, a free suite of financial and tax calculators built for accuracy, transparency and privacy.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('About RateWise', 'Learn about RateWise.', `${siteUrl}/about`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'About' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'About' }]} />
        <h1 className="text-3xl font-bold mb-6">About RateWise</h1>
        <div className="prose prose-slate max-w-none">
          <p>
            RateWise is a free, open-source calculator hub designed to help individuals and businesses make informed
            financial decisions. We provide accurate, easy-to-use calculators for VAT, sales tax, salary, compound
            interest, loans, and financial independence planning.
          </p>
          <h2>Our Mission</h2>
          <p>
            We believe everyone should have access to professional-grade financial tools without hidden fees or
            sign-up walls. Our calculators are built with transparent formulas informed by official government tax
            rates and financial standards.
          </p>
          <h2>How We Stay Free</h2>
          <p>
            RateWise is supported by non-intrusive display advertising. We never sell your data or charge for
            calculator access. Our commitment is to keep every tool freely available forever.
          </p>
          <h2>Accuracy & Transparency</h2>
          <p>
            All calculator logic is open source and can be inspected. We source tax rates from official government
            publications and update them regularly. However, our tools are for informational purposes only — always
            consult a qualified professional for important financial or tax decisions.
          </p>
          <h2>Technology</h2>
          <p>
            RateWise is built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. We use server-side rendering
            for SEO and performance, with client-side interactivity where needed for our calculator interfaces.
          </p>
        </div>
      </div>
    </>
  );
}
