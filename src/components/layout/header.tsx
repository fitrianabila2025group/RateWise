import Link from 'next/link';
import { Calculator, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/vat', label: 'VAT Calculator' },
  { href: '/sales-tax', label: 'Sales Tax' },
  { href: '/salary', label: 'Salary Calculator' },
  { href: '/finance', label: 'Finance Tools' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="RateWise Home">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">RateWise</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu - simple toggle via details/summary for zero JS */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </summary>
          <nav
            className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-background shadow-lg p-2"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
