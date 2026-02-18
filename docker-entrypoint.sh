#!/bin/sh
set -e

echo "RateWise – Docker Entrypoint"
echo "================================"

# ─── Wait for database to be ready (up to 60 s) ──────────────────────
echo "Waiting for database..."
MAX_RETRIES=30
RETRY=0
until echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "Database not reachable after $MAX_RETRIES attempts. Starting anyway..."
    break
  fi
  echo "  Retry $RETRY/$MAX_RETRIES..."
  sleep 2
done
echo "Database is ready."

# ─── Run migrations (idempotent) ─────────────────────────────────────
echo "Running prisma migrate deploy..."
npx prisma migrate deploy || {
  echo "migrate deploy failed (maybe first run). Trying db push..."
  npx prisma db push --accept-data-loss || echo "db push also failed – check DATABASE_URL"
}

# ─── Seed database (idempotent – uses upserts) ──────────────────────
echo "Running database seed..."
node prisma/seed.cjs || echo "Seed skipped (not critical for startup)"

# ─── Start the Next.js standalone server ────────────────────────────
# output: 'standalone' in next.config.js produces server.js
echo "Starting Next.js server..."
exec node server.js
