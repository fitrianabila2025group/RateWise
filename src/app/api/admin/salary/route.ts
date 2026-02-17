import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  countryCode: z.string().min(2).max(3),
  countryName: z.string().min(1),
  config: z.string().min(2),
});

export async function GET() {
  const configs = await prisma.salaryConfig.findMany({ orderBy: { countryCode: 'asc' } });
  return NextResponse.json(configs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    // Validate JSON
    JSON.parse(data.config);
    const config = await prisma.salaryConfig.create({ data });
    await logAudit('CREATE', 'SalaryConfig', config.id);
    return NextResponse.json(config, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
