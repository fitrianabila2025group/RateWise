import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { requireAdmin } from '@/lib/require-admin';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional().default(''),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: data.role,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    await logAudit('CREATE', 'User', user.id);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
