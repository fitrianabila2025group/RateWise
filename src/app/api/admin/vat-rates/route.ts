import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const vatSchema = z.object({
  countryCode: z.string().length(2),
  countryName: z.string().min(1),
  standardRate: z.number().min(0),
  reducedRate: z.number().nullable().optional(),
  superReducedRate: z.number().nullable().optional(),
  parkingRate: z.number().nullable().optional(),
  currency: z.string().default('EUR'),
});

export async function GET() {
  const rates = await prisma.vatRate.findMany({ orderBy: { countryName: 'asc' } });
  return NextResponse.json(rates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = vatSchema.parse(body);
    const rate = await prisma.vatRate.create({ data });
    await logAudit('CREATE', 'VatRate', rate.id);
    return NextResponse.json(rate, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create VAT rate' }, { status: 500 });
  }
}
