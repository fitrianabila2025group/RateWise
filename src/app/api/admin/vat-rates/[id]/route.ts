import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const vatUpdateSchema = z.object({
  countryCode: z.string().length(2).optional(),
  countryName: z.string().min(1).optional(),
  standardRate: z.number().min(0).optional(),
  reducedRate: z.number().nullable().optional(),
  superReducedRate: z.number().nullable().optional(),
  parkingRate: z.number().nullable().optional(),
  currency: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rate = await prisma.vatRate.findUnique({ where: { id } });
  if (!rate) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rate);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = vatUpdateSchema.parse(body);
    const rate = await prisma.vatRate.update({ where: { id }, data });
    await logAudit('UPDATE', 'VatRate', rate.id);
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
    await prisma.vatRate.delete({ where: { id } });
    await logAudit('DELETE', 'VatRate', id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
