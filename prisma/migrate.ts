/**
 * Lightweight migration runner that uses @prisma/client directly.
 * Replaces `prisma migrate deploy` so we don't need the prisma CLI
 * (and its heavy transitive deps) in the production Docker image.
 *
 * Compiled to prisma/migrate.cjs via esbuild at build time.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Running migrations...');

  // 1. Create _prisma_migrations tracking table (same schema Prisma uses)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id"                  VARCHAR(36)  NOT NULL PRIMARY KEY,
      "checksum"            VARCHAR(64)  NOT NULL,
      "finished_at"         TIMESTAMPTZ,
      "migration_name"      VARCHAR(255) NOT NULL,
      "logs"                TEXT,
      "rolled_back_at"      TIMESTAMPTZ,
      "started_at"          TIMESTAMPTZ  NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER      NOT NULL DEFAULT 0
    );
  `);

  // 2. Discover migration directories (sorted)
  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found – skipping.');
    return;
  }

  const dirs = fs.readdirSync(migrationsDir).filter(d => {
    const sqlPath = path.join(migrationsDir, d, 'migration.sql');
    return fs.existsSync(sqlPath);
  }).sort();

  if (dirs.length === 0) {
    console.log('No migration files found.');
    return;
  }

  // 3. Apply each migration if not already applied
  for (const dir of dirs) {
    const applied: unknown[] = await prisma.$queryRawUnsafe(
      `SELECT id FROM "_prisma_migrations" WHERE "migration_name" = $1 AND "finished_at" IS NOT NULL`,
      dir,
    );

    if (applied.length > 0) {
      console.log(`  ✓ ${dir} (already applied)`);
      continue;
    }

    const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');

    console.log(`  → Applying ${dir}...`);

    // Split by statement to handle multi-statement SQL safely
    const statements = sql
      .split(/;\s*$/m)               // split on ";" at end of line
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }

    // Record the migration
    const id = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "finished_at", "applied_steps_count")
       VALUES ($1, $2, $3, NOW(), $4)`,
      id,
      checksum,
      dir,
      statements.length,
    );

    console.log(`  ✓ ${dir} applied (${statements.length} statements)`);
  }

  console.log('Migrations complete.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Migration failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
