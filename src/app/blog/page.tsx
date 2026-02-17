import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { JsonLd, webPageJsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog – Financial Tips, Tax Guides & Calculator Tutorials | RateWise',
  description:
    'Read our latest articles on taxes, personal finance, salary calculations and more. Practical guides to help you make smarter financial decisions.',
  alternates: { canonical: '/blog' },
};

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        description: true,
        featuredImage: true,
        publishedAt: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={webPageJsonLd('Blog', 'Financial tips, tax guides and calculator tutorials.', `${siteUrl}/blog`)} />
      <JsonLd data={breadcrumbJsonLd([{ label: 'Blog' }], siteUrl)} />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Blog' }]} />

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Financial tips, tax guides, and tutorials to help you get the most out of our calculators.
        </p>

        <AdSlot slot="top-banner" />

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              We're working on our first articles. Check back soon for financial tips, tax guides, and calculator
              tutorials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-lg overflow-hidden">
                  {post.featuredImage && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    {post.publishedAt && (
                      <CardDescription>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {post.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}

        <AdSlot slot="in-content" />
      </div>
    </>
  );
}
