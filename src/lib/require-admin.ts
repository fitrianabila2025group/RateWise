import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * Verify the current request is from an authenticated ADMIN user.
 * Returns a NextResponse (401/403) if unauthorized, or null if authorised.
 *
 * Usage in route handlers:
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 *
 * Pass `allowEditor: true` to also permit EDITOR role.
 */
export async function requireAdmin(
  options: { allowEditor?: boolean } = {},
): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  const allowed = role === 'ADMIN' || (options.allowEditor && role === 'EDITOR');

  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
