import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Cookie Policy | RateWise',
  description: 'RateWise cookie policy – what cookies we use and how to manage them.',
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePolicyPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('Cookie Policy', 'RateWise cookie policy.', `${siteUrl}/cookie-policy`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Cookie Policy' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'Cookie Policy' }]} />
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help the site remember
            your preferences and improve your browsing experience.
          </p>

          <h2>Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are strictly necessary for the website to function. They include:
          </p>
          <ul>
            <li><strong>cookie-consent:</strong> Remembers your cookie preferences.</li>
            <li><strong>next-auth.session-token:</strong> Admin authentication session (admin users only).</li>
          </ul>

          <h3>Analytics Cookies (Optional)</h3>
          <p>
            With your consent, we use Google Analytics to understand how visitors use our site. These cookies collect
            anonymised data including pages visited, time on site, and referral source.
          </p>

          <h3>Advertising Cookies (Optional)</h3>
          <p>
            With your consent, Google AdSense may set cookies to serve personalised advertisements. Without consent,
            only non-personalised ads are shown.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            You can manage your cookie preferences by clicking the cookie settings in the consent banner. You can
            also clear cookies through your browser settings at any time.
          </p>

          <h2>More Information</h2>
          <p>
            For more information about how we handle your data, please see our <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}
