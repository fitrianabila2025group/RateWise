import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { requireAdmin } from '@/lib/require-admin';
import { z } from 'zod';

const vatSchema = z.object({
  countryCode: z.string().length(2),
  countryName: z.string().min(1),
  standardRate: z.number().min(0),
  reducedRate: z.number().nullable().optional(),
  superReduced: z.number().nullable().optional(),
  parkingRate: z.number().nullable().optional(),
  effectiveDate: z.string().optional(),
  notes: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const rates = await prisma.vatRate.findMany({ orderBy: { countryName: 'asc' } });
  return NextResponse.json(rates);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = vatSchema.parse(body);
    const { effectiveDate, ...rest } = parsed;
    const rate = await prisma.vatRate.create({
      data: {
        ...rest,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      },
    });
    await logAudit('CREATE', 'VatRate', rate.id);
    return NextResponse.json(rate, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create VAT rate' }, { status: 500 });
  }
}
