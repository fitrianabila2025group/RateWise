import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  stateCode: z.string().length(2),
  stateName: z.string().min(1),
  stateRate: z.number().min(0),
  avgLocalRate: z.number().nullable().optional(),
  combinedRate: z.number().nullable().optional(),
});

export async function GET() {
  const rates = await prisma.salesTaxRate.findMany({ orderBy: { stateName: 'asc' } });
  return NextResponse.json(rates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const rate = await prisma.salesTaxRate.create({ data });
    await logAudit('CREATE', 'SalesTaxRate', rate.id);
    return NextResponse.json(rate, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
