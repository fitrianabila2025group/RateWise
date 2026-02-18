FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Compile seed.ts and migrate.ts to CJS for production runtime (no tsx/prisma CLI needed)
RUN npx esbuild prisma/seed.ts prisma/migrate.ts --bundle --platform=node --format=cjs --outdir=prisma --out-extension:.js=.cjs --external:@prisma/client --external:bcryptjs

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
# Ensure LF line endings (in case of Windows checkout)
RUN sed -i 's/\r$//' ./docker-entrypoint.sh

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma client + seed dependencies (NO prisma CLI needed – we use our own migrate.cjs)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Copy compiled migration + seed scripts
COPY --from=builder /app/prisma/seed.cjs ./prisma/seed.cjs
COPY --from=builder /app/prisma/migrate.cjs ./prisma/migrate.cjs
COPY --from=builder /app/package.json ./package.json

RUN chmod +x ./docker-entrypoint.sh
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
