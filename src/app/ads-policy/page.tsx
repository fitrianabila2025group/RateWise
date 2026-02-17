import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Advertising Policy | RateWise',
  description: 'RateWise advertising policy – how we display ads and our commitment to a good user experience.',
  alternates: { canonical: '/ads-policy' },
};

export default function AdsPolicyPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('Advertising Policy', 'RateWise advertising policy.', `${siteUrl}/ads-policy`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Advertising Policy' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'Advertising Policy' }]} />
        <h1 className="text-3xl font-bold mb-6">Advertising Policy</h1>
        <div className="prose prose-slate max-w-none">
          <h2>How We Fund RateWise</h2>
          <p>
            RateWise is a free service. To keep it that way, we display non-intrusive advertisements via Google
            AdSense. Advertising revenue covers our hosting, development, and data maintenance costs.
          </p>

          <h2>Our Ad Principles</h2>
          <ul>
            <li><strong>Non-intrusive:</strong> Ads are placed in designated slots and never obscure calculator content.</li>
            <li><strong>No pop-ups:</strong> We never use pop-up, pop-under, or interstitial ads.</li>
            <li><strong>Clearly labelled:</strong> All ad placements are visually distinct from editorial content.</li>
            <li><strong>Privacy-respecting:</strong> Personalised ads require cookie consent. Without consent, only contextual ads are shown.</li>
          </ul>

          <h2>Ad Placement</h2>
          <p>
            Ads may appear in the following locations:
          </p>
          <ul>
            <li>Top of page (banner)</li>
            <li>Sidebar on desktop layouts</li>
            <li>Between content sections</li>
            <li>Footer area</li>
          </ul>

          <h2>Editorial Independence</h2>
          <p>
            Advertising has no influence on our calculator formulas, tax rate data, or editorial content.
            Our calculations are based solely on official government rates and standard financial formulas.
          </p>
        </div>
      </div>
    </>
  );
}
