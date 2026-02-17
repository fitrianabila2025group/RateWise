import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  stateCode: z.string().length(2).optional(),
  stateName: z.string().min(1).optional(),
  stateRate: z.number().min(0).optional(),
  avgLocalRate: z.number().nullable().optional(),
  combinedRate: z.number().nullable().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rate = await prisma.salesTaxRate.findUnique({ where: { id } });
  if (!rate) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rate);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = schema.parse(body);
    const rate = await prisma.salesTaxRate.update({ where: { id }, data });
    await logAudit('UPDATE', 'SalesTaxRate', rate.id);
    return NextResponse.json(rate);
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
    await prisma.salesTaxRate.delete({ where: { id } });
    await logAudit('DELETE', 'SalesTaxRate', id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
