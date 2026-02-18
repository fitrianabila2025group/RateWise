import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service | RateWise',
  description: 'RateWise terms of service – conditions for using our calculators and website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('Terms of Service', 'RateWise terms of service.', `${siteUrl}/terms`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Terms of Service' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'Terms of Service' }]} />
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="prose prose-slate max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RateWise, you agree to be bound by these Terms of Service. If you do not agree,
            please do not use our website.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            RateWise provides free online financial and tax calculators for informational purposes. Our tools include
            VAT calculators, sales tax calculators, salary calculators, compound interest calculators, loan calculators,
            and FIRE calculators.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            All calculations are provided for <strong>informational purposes only</strong> and do not constitute
            financial, tax, or legal advice. While we strive for accuracy, we make no guarantees about the correctness,
            completeness, or currentness of any calculation result. Always consult a qualified professional for
            important financial decisions.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            RateWise shall not be liable for any direct, indirect, incidental, consequential, or punitive damages
            arising from your use of or reliance on our calculators or content.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The RateWise website design, content, and brand are protected by copyright. Our calculator source code
            is available under open-source licence terms as specified in our GitHub repository.
          </p>

          <h2>6. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to the admin panel or backend systems</li>
            <li>Scrape, crawl, or harvest data in a way that overloads our servers</li>
            <li>Interfere with or disrupt the website's functionality</li>
          </ul>

          <h2>7. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the website after changes constitutes
            acceptance of the revised Terms.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be
            resolved in the appropriate jurisdiction.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about these Terms? Contact us at <a href="mailto:hello@ratewise.es">hello@ratewise.es</a>.
          </p>
        </div>
      </div>
    </>
  );
}
