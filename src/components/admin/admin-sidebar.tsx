'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'VAT Rates', href: '/admin/vat-rates' },
  { label: 'Sales Tax', href: '/admin/sales-tax' },
  { label: 'Salary', href: '/admin/salary' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Users', href: '/admin/users' },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link href="/admin" className="text-xl font-bold">
          RateWise <span className="text-sm font-normal text-muted-foreground">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <div className="text-sm">
          <p className="font-medium truncate">{session?.user?.email}</p>
          <p className="text-muted-foreground text-xs">{session?.user?.role}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/">View Site</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex-1"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
