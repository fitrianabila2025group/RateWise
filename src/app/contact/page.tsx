import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Contact Us | RateWise',
  description: 'Get in touch with the RateWise team. Report bugs, suggest features or ask questions.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <JsonLd data={webPageJsonLd('Contact Us', 'Contact the RateWise team.', `${siteUrl}/contact`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Contact' }], siteUrl)} />
      <div className="container py-12 max-w-3xl">
        <Breadcrumb items={[{ label: 'Contact' }]} />
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="prose prose-slate max-w-none">
          <p>
            Have a question, found a bug, or want to suggest a new calculator? We'd love to hear from you.
          </p>
          <h2>Email</h2>
          <p>
            You can reach us at <a href="mailto:hello@ratewise.es">hello@ratewise.es</a>.
          </p>
          <h2>GitHub</h2>
          <p>
            RateWise is open source. You can file issues, submit pull requests, or start discussions on our{' '}
            <a href="https://github.com/fitrianabila2025group/RateWise" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
          <h2>Response Time</h2>
          <p>
            We aim to respond to all inquiries within 2 business days. For bug reports, please include your browser,
            operating system, and steps to reproduce the issue.
          </p>
        </div>
      </div>
    </>
  );
}
