import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/layout/breadcrumb';
import { AdSlot } from '@/components/layout/ad-slot';
import { SharePageButton } from '@/components/shared/action-buttons';
import { JsonLd } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | RateWise Blog`,
    description: post.description || post.title,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const siteUrl = getSiteUrl();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description || post.title,
    url: `${siteUrl}/blog/${slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    ...(post.featuredImage ? { image: post.featuredImage } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'RateWise',
      url: siteUrl,
    },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title },
          ],
        }}
      />

      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
              <SharePageButton />
            </div>
            {post.publishedAt && (
              <time className="text-sm text-muted-foreground" dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </header>

          {post.featuredImage && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <AdSlot slot="top-banner" />

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdSlot slot="in-content" />
        </article>
      </div>
    </>
  );
}
