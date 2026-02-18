#!/bin/sh
set -e

echo "🚀 RateWise – Docker Entrypoint"
echo "================================"

# ─── Wait for database to be ready ────────────────────────────────────
echo "⏳ Waiting for database..."
MAX_RETRIES=30
RETRY=0
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "❌ Database not reachable after $MAX_RETRIES attempts. Starting anyway..."
    break
  fi
  echo "   Retry $RETRY/$MAX_RETRIES..."
  sleep 2
done

# ─── Run migrations (idempotent) ─────────────────────────────────────
echo "📦 Running prisma migrate deploy..."
npx prisma migrate deploy 2>/dev/null || {
  echo "⚠️  migrate deploy failed (maybe first run). Trying db push..."
  npx prisma db push --accept-data-loss 2>/dev/null || echo "⚠️  db push also failed – check DATABASE_URL"
}

# ─── Seed database (idempotent – uses upserts) ──────────────────────
echo "🌱 Running database seed..."
node prisma/seed.js 2>/dev/null || echo "⚠️  Seed skipped (not critical for startup)"

# ─── Start the Next.js server ───────────────────────────────────────
echo "✅ Starting Next.js server..."
exec node server.js
