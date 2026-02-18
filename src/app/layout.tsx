import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { JsonLd, websiteJsonLd } from '@/components/seo/json-ld';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ratewise.es'),
  title: {
    default: 'RateWise – Free VAT, Sales Tax, Salary & Finance Calculators',
    template: '%s | RateWise',
  },
  description:
    'Free online calculators for VAT (EU), US sales tax, salary/take-home pay, compound interest, loan amortization, and FIRE planning. Accurate, fast, and mobile-friendly.',
  keywords: [
    'VAT calculator',
    'sales tax calculator',
    'salary calculator',
    'take-home pay',
    'compound interest calculator',
    'loan calculator',
    'mortgage calculator',
    'FIRE calculator',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'RateWise',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent />
        </TooltipProvider>
      </body>
    </html>
  );
}
