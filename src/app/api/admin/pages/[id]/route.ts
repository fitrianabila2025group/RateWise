import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().default(0),
});

const updateSchema = z.object({
  slug: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  metaDescription: z.string().optional(),
  h1: z.string().optional(),
  introParagraph: z.string().optional(),
  howItWorks: z.string().optional(),
  examples: z.string().optional(),
  faqs: z.array(faqSchema).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const page = await prisma.landingPage.findUnique({
    where: { id },
    include: { faqs: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { faqs, ...data } = updateSchema.parse(body);

    const page = await prisma.landingPage.update({ where: { id }, data });

    if (faqs) {
      await prisma.faq.deleteMany({ where: { landingPageId: id } });
      if (faqs.length > 0) {
        await prisma.faq.createMany({
          data: faqs.map((faq, i) => ({
            ...faq,
            sortOrder: faq.sortOrder ?? i,
            landingPageId: id,
          })),
        });
      }
    }

    await logAudit('UPDATE', 'LandingPage', page.id);
    return NextResponse.json(page);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.faq.deleteMany({ where: { landingPageId: id } });
    await prisma.landingPage.delete({ where: { id } });
    await logAudit('DELETE', 'LandingPage', id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
