import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ratewise.es';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/vat`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/sales-tax`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/salary`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/finance`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/finance/compound-interest`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/finance/loan-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/finance/fire`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/ads-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Dynamic: VAT country pages
  let vatPages: MetadataRoute.Sitemap = [];
  try {
    const vatRates = await prisma.vatRate.findMany({ select: { countryName: true, updatedAt: true } });
    vatPages = vatRates.map((v) => ({
      url: `${siteUrl}/vat/${v.countryName.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: v.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available
  }

  // Dynamic: Sales tax state pages
  let salesTaxPages: MetadataRoute.Sitemap = [];
  try {
    const salesTaxRates = await prisma.salesTaxRate.findMany({ select: { stateName: true, updatedAt: true } });
    salesTaxPages = salesTaxRates.map((s) => ({
      url: `${siteUrl}/sales-tax/${s.stateName.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available
  }

  // Dynamic: Salary country pages
  let salaryPages: MetadataRoute.Sitemap = [];
  try {
    const salaryConfigs = await prisma.salaryConfig.findMany({ select: { countryName: true, updatedAt: true } });
    salaryPages = salaryConfigs.map((s) => ({
      url: `${siteUrl}/salary/${s.countryName.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available
  }

  // Dynamic: Blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available
  }

  return [...staticPages, ...vatPages, ...salesTaxPages, ...salaryPages, ...blogPages];
}
