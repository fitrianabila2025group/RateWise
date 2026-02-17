import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function logAudit(action: string, entity: string, entityId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return;
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId: entityId || null,
        userId: session.user.id,
      },
    });
  } catch {
    // Silently fail – audit log should not break operations
  }
}
