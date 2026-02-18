#!/bin/sh
set -e

echo "RateWise – Docker Entrypoint"
echo "================================"

# ─── Wait for database to be ready (up to 60 s) ──────────────────────
echo "Waiting for database..."
MAX_RETRIES=30
RETRY=0
until node -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  p.\$queryRawUnsafe('SELECT 1').then(() => { p.\$disconnect(); process.exit(0); }).catch(() => { p.\$disconnect(); process.exit(1); });
" > /dev/null 2>&1; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "Database not reachable after $MAX_RETRIES attempts."
    break
  fi
  echo "  Retry $RETRY/$MAX_RETRIES..."
  sleep 2
done
echo "Database connection OK."

# ─── Run migrations (idempotent, uses @prisma/client directly) ───────
echo "Running migrations..."
node prisma/migrate.cjs || echo "Migration failed – check DATABASE_URL"

# ─── Seed database (idempotent – uses upserts) ──────────────────────
echo "Running database seed..."
node prisma/seed.cjs || echo "Seed skipped (not critical for startup)"

# ─── Start the Next.js standalone server ────────────────────────────
echo "Starting Next.js server..."
exec node server.js
