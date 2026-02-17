import Link from 'next/link';
import { Calculator } from 'lucide-react';

const footerLinks = {
  Calculators: [
    { href: '/vat', label: 'VAT Calculator' },
    { href: '/sales-tax', label: 'Sales Tax Calculator' },
    { href: '/salary', label: 'Salary Calculator' },
    { href: '/finance/compound-interest', label: 'Compound Interest' },
    { href: '/finance/loan-calculator', label: 'Loan Calculator' },
    { href: '/finance/fire', label: 'FIRE Calculator' },
  ],
  Resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
    { href: '/ads-policy', label: 'Ads Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="font-bold">RateWise</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free, accurate financial calculators for VAT, sales tax, salary, and investment planning.
              Built for professionals across the USA and Europe.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-3 text-sm">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RateWise. All rights reserved.</p>
          <p className="mt-1">
            Calculator results are estimates for informational purposes only. Always consult a qualified
            professional for financial, tax, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
