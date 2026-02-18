import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy | RateWise',
  description: 'RateWise privacy policy – how we collect, use and protect your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('Privacy Policy', 'RateWise privacy policy.', `${siteUrl}/privacy`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Privacy Policy' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="prose prose-slate max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            RateWise does not require user registration to use our calculators. We collect minimal data:
          </p>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, time on site, device type and browser (via analytics cookies when consent is given).</li>
            <li><strong>Calculator inputs:</strong> All calculator computations happen in your browser or on our server. We do not store your calculation inputs or results.</li>
          </ul>

          <h2>2. Cookies</h2>
          <p>
            We use essential cookies for site functionality and optional analytics/advertising cookies only with your
            consent. See our <a href="/cookie-policy">Cookie Policy</a> for full details.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>
            We may use the following third-party services that set their own cookies:
          </p>
          <ul>
            <li><strong>Google AdSense:</strong> Displays personalised or non-personalised ads based on your cookie consent.</li>
            <li><strong>Google Analytics:</strong> Collects anonymised usage statistics to help us improve the site.</li>
          </ul>

          <h2>4. Data Storage</h2>
          <p>
            Admin account data (email and hashed passwords) is stored in our PostgreSQL database. We do not store
            end-user personal data.
          </p>

          <h2>5. Your Rights (GDPR)</h2>
          <p>
            If you are located in the European Economic Area, you have the right to:
          </p>
          <ul>
            <li>Access any personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We use HTTPS encryption, secure password hashing (bcrypt), and follow web security best practices
            including Content Security headers.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an updated date.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about this policy? Contact us at <a href="mailto:hello@ratewise.es">hello@ratewise.es</a>.
          </p>
        </div>
      </div>
    </>
  );
}
