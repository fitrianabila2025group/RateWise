import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [vatRates, salesTaxRates, salaryConfigs, landingPages, blogPosts, users] =
      await Promise.all([
        prisma.vatRate.count(),
        prisma.salesTaxRate.count(),
        prisma.salaryConfig.count(),
        prisma.landingPage.count(),
        prisma.blogPost.count(),
        prisma.user.count(),
      ]);
    return { vatRates, salesTaxRates, salaryConfigs, landingPages, blogPosts, users };
  } catch {
    return { vatRates: 0, salesTaxRates: 0, salaryConfigs: 0, landingPages: 0, blogPosts: 0, users: 0 };
  }
}

async function getRecentAudit() {
  try {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { email: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentAudit = await getRecentAudit();

  const statCards = [
    { label: 'VAT Rates', value: stats.vatRates, href: '/admin/vat-rates' },
    { label: 'Sales Tax Rates', value: stats.salesTaxRates, href: '/admin/sales-tax' },
    { label: 'Salary Configs', value: stats.salaryConfigs, href: '/admin/salary' },
    { label: 'Landing Pages', value: stats.landingPages, href: '/admin/pages' },
    { label: 'Blog Posts', value: stats.blogPosts, href: '/admin/blog' },
    { label: 'Users', value: stats.users, href: '/admin/users' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAudit.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAudit.map((log) => (
                <div key={log.id} className="flex items-start justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-muted-foreground text-xs">
                      {log.entity} {log.entityId ? `#${log.entityId}` : ''} – by {log.user.email}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </time>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
