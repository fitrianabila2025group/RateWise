'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu, LogOut, ExternalLink } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'VAT Rates', href: '/admin/vat-rates' },
  { label: 'Sales Tax', href: '/admin/sales-tax' },
  { label: 'Salary', href: '/admin/salary' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Ads', href: '/admin/ads', adminOnly: true },
  { label: 'Settings', href: '/admin/settings', adminOnly: true },
  { label: 'Users', href: '/admin/users', adminOnly: true },
];

function SidebarContent({
  visibleItems,
  pathname,
  session,
  role,
  onNavigate,
}: {
  visibleItems: NavItem[];
  pathname: string;
  session: ReturnType<typeof useSession>['data'];
  role: string | undefined;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
          <p className="text-muted-foreground text-xs">{role}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/" onClick={onNavigate}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex-1"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const role = (session?.user as { role?: string } | undefined)?.role;

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || role === 'ADMIN',
  );

  // Derive current page title from pathname
  const currentPageTitle =
    navItems.find((item) => item.href === pathname)?.label || 'Admin';

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 h-14">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open admin menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>
                RateWise <span className="text-sm font-normal text-muted-foreground">Admin</span>
              </SheetTitle>
              <SheetDescription className="sr-only">Admin navigation menu</SheetDescription>
            </SheetHeader>
            <SidebarContent
              visibleItems={visibleItems}
              pathname={pathname}
              session={session}
              role={role}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold">{currentPageTitle}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-xs"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r min-h-screen flex-col">
        <div className="p-4 border-b">
          <Link href="/admin" className="text-xl font-bold">
            RateWise <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <SidebarContent
          visibleItems={visibleItems}
          pathname={pathname}
          session={session}
          role={role}
        />
      </aside>
    </>
  );
}
