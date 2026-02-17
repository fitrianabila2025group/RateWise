import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  slug: z.string().min(1),
  section: z.string().min(1),
  title: z.string().min(1),
  metaDescription: z.string().optional().default(''),
  h1: z.string().optional().default(''),
  introParagraph: z.string().optional().default(''),
  howItWorks: z.string().optional().default(''),
  examples: z.string().optional().default(''),
});

export async function GET() {
  const pages = await prisma.landingPage.findMany({
    orderBy: { slug: 'asc' },
    include: { _count: { select: { faqs: true } } },
  });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const page = await prisma.landingPage.create({ data });
    await logAudit('CREATE', 'LandingPage', page.id);
    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
