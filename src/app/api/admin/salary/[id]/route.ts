import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  countryCode: z.string().min(2).max(3).optional(),
  countryName: z.string().min(1).optional(),
  config: z.string().min(2).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const config = await prisma.salaryConfig.findUnique({ where: { id } });
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = schema.parse(body);
    if (data.config) JSON.parse(data.config);
    const config = await prisma.salaryConfig.update({ where: { id }, data });
    await logAudit('UPDATE', 'SalaryConfig', config.id);
    return NextResponse.json(config);
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
    await prisma.salaryConfig.delete({ where: { id } });
    await logAudit('DELETE', 'SalaryConfig', id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
