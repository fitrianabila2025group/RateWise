# RateWise – Calculator Hub

A production-ready, SEO-optimized calculator hub targeting USA + Europe traffic. Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 7 Calculators
- **VAT Calculator** – Add/remove VAT for 27 EU countries
- **Sales Tax Calculator** – US sales tax for all 50 states + DC
- **Salary Calculator** – Net pay after tax (US, UK, Germany, France, Netherlands)
- **Hourly ↔ Salary Converter** – With overtime support
- **Compound Interest Calculator** – Daily/monthly/quarterly/annual compounding with contributions
- **Loan / Mortgage Calculator** – Amortisation schedule with extra payments
- **FIRE Calculator** – Financial Independence, Retire Early with Lean/Fat/Coast variants

### SEO & Monetisation
- 80+ programmatic landing pages (one per country/state)
- FAQ sections with JSON-LD structured data
- Dynamic sitemap & robots.txt
- Ad slots (AdSense-ready) on every page
- Cookie consent banner (GDPR-compliant)
- OpenGraph meta & canonical URLs
- BreadcrumbList schema markup

### Admin Panel
- Full CRUD for VAT rates, sales tax rates, salary configs
- Landing page SEO content editor with FAQ management
- Blog post manager (create, edit, publish/draft)
- Site settings manager
- User management (ADMIN/EDITOR roles)
- Audit log dashboard
- Protected by NextAuth with JWT + role-based middleware

### Additional
- Light/dark theme (CSS variables)
- Responsive mobile-first design
- Docker + docker-compose deployment
- Vitest test suite (24 tests)
- TypeScript strict mode
- Security headers (HSTS, X-Frame-Options, CSP-ready)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 + shadcn/ui components |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Auth | NextAuth 4 (JWT + Credentials) |
| Testing | Vitest |
| Deploy | Docker + docker-compose |

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)

### 1. Clone & Install

```bash
git clone https://github.com/fitrianabila2025group/RateWise.git
cd RateWise
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://ratewise:ratewise_secret@localhost:5432/ratewise"
NEXT_PUBLIC_SITE_URL="https://app.ratewise.es"
NEXTAUTH_URL="https://app.ratewise.es"
NEXTAUTH_SECRET="your-random-secret-here"
ADMIN_EMAIL="admin@ratewise.es"
ADMIN_PASSWORD="your-secure-password"
CONTACT_EMAIL="hello@ratewise.es"
```

> **Important:** Set `NEXT_PUBLIC_SITE_URL=https://app.ratewise.es` for correct canonical URLs, sitemap, and robots.txt.

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data (VAT rates, sales tax, salary configs, landing pages)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Access Admin Panel

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the credentials from your `.env` file.

---

## Docker Deployment

### Quick Start (recommended)

```bash
# Build and start all services (auto-migrates & seeds the database)
docker-compose up -d
```

The app will be available at `http://localhost:3000`. The entrypoint script (`docker-entrypoint.sh`, POSIX sh compatible) automatically:
1. Waits for PostgreSQL to be ready (up to 60 seconds)
2. Runs `prisma migrate deploy` (applies pending migrations)
3. Runs the compiled seed (`node prisma/seed.cjs`) — creates admin user, VAT rates, sales tax rates, salary configs, landing pages
4. Starts the Next.js standalone server (`node server.js`)

> **Admin credentials** are set by `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables. Default: `admin@ratewise.es` / `Admin123!`

### Build & Push to DockerHub

```bash
# Build the image
docker build -t mpratamamail/ratewise:latest .

# Tag with a version
docker build -t mpratamamail/ratewise:latest -t mpratamamail/ratewise:v1.0.2 .

# Push to DockerHub
docker push mpratamamail/ratewise:latest
docker push mpratamamail/ratewise:v1.0.2
```

### Production Deployment

For production, update environment variables in `docker-compose.yml`:

```yaml
environment:
  DATABASE_URL: postgresql://ratewise:ratewise_secret@db:5432/ratewise
  NEXTAUTH_URL: https://app.ratewise.es      # Your public domain
  NEXTAUTH_SECRET: <run: openssl rand -base64 32>
  NEXT_PUBLIC_SITE_URL: https://app.ratewise.es
  ADMIN_EMAIL: admin@ratewise.es
  ADMIN_PASSWORD: <your-secure-password>
```

> **DATABASE_URL format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
> In docker-compose, `HOST` is the service name (e.g. `db`), and `PASSWORD` must match `POSTGRES_PASSWORD`.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | – |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/canonical | `https://app.ratewise.es` |
| `NEXTAUTH_URL` | Base URL of the app | `https://app.ratewise.es` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | – |
| `ADMIN_EMAIL` | Initial admin email | `admin@ratewise.es` |
| `ADMIN_PASSWORD` | Initial admin password | `Admin123!` |
| `CONTACT_EMAIL` | Contact email shown on public pages | `hello@ratewise.es` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | – |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin/                # Admin panel (dashboard, CRUD pages)
│   ├── api/                  # API routes
│   │   ├── admin/            # Admin CRUD endpoints
│   │   └── auth/             # NextAuth endpoints
│   ├── blog/                 # Blog listing & post pages
│   ├── finance/              # Compound interest, loan, FIRE
│   ├── salary/               # Salary calculator pages
│   ├── sales-tax/            # Sales tax calculator pages
│   ├── vat/                  # VAT calculator pages
│   ├── about/privacy/terms/  # Static policy pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── robots.ts             # Dynamic robots.txt
│   └── sitemap.ts            # Dynamic XML sitemap
├── components/
│   ├── admin/                # Admin UI components
│   ├── calculators/          # Calculator form components
│   ├── layout/               # Header, footer, breadcrumb, ads
│   ├── providers/            # Auth provider
│   ├── seo/                  # JSON-LD, FAQ section
│   ├── shared/               # Disclaimer, action buttons
│   └── ui/                   # shadcn/ui base components
├── lib/
│   ├── calculators/          # Calculator business logic
│   ├── auth.ts               # NextAuth configuration
│   ├── audit.ts              # Audit logging helper
│   ├── db.ts                 # Prisma singleton
│   └── utils.ts              # Utility functions
├── middleware.ts              # Admin route protection
├── types/                    # TypeScript type declarations
└── __tests__/                # Vitest test files
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed data
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

---

## Calculator Formulas

### VAT
- **Add VAT (exclusive):** `gross = net × (1 + rate/100)`
- **Remove VAT (inclusive):** `net = gross / (1 + rate/100)`

### Sales Tax
- `tax = amount × (rate / 100)`
- `total = amount + stateTax + localTax`

### Compound Interest
- `A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]`

### Loan Amortisation
- `M = P × [r(1+r)^n] / [(1+r)^n - 1]`

### FIRE
- `FIRE Number = Annual Expenses / Safe Withdrawal Rate`

---

## Admin Panel

The admin panel at `/admin` provides:

1. **Dashboard** – Overview stats and recent audit log
2. **VAT Rates** – CRUD for EU VAT rates
3. **Sales Tax** – CRUD for US state sales tax rates
4. **Salary** – CRUD for country salary configurations (JSON)
5. **Pages** – Edit landing page SEO content and FAQs
6. **Blog** – Create, edit, publish/unpublish blog posts
7. **Ads** – Configure ad providers, enable/disable slots, set ad codes (ADMIN only)
8. **Settings** – Site-wide settings (site name, etc.) (ADMIN only)
9. **Users** – Manage admin and editor accounts (ADMIN only)

All changes are logged in the audit trail.

### Ads Manager (`/admin/ads`)

The Ads Manager lets you configure ad placements without editing code:

- **Provider**: Choose between Google AdSense or custom HTML.
- **Slot toggles**: Enable/disable each of the 4 ad positions (top-banner, sidebar, in-content, footer).
- **AdSense**: Enter your publisher ID (`ca-pub-xxx`) and per-slot IDs.
- **Custom HTML**: Paste ad code per slot. Dangerous tags/event handlers are stripped automatically.
- **Non-personalized ads**: Toggle default NPA mode for GDPR compliance.
- **Global scripts**: Inject head/body scripts (analytics, tag managers).
- **Preview**: See a safe preview of what each slot will render.

### Security

- All `/admin` pages require authentication via NextAuth JWT.
- All `/api/admin/*` endpoints enforce server-side role checks:
  - **ADMIN only**: Ads, Settings, Users.
  - **ADMIN + EDITOR**: Blog, Pages, VAT Rates, Sales Tax, Salary.
- Middleware (`src/middleware.ts`) protects both page routes and API routes.
- Custom HTML ads are sanitized server-side using DOMPurify.

---

## SEO Pages

The site generates programmatic landing pages for:

- `/vat/[country]` – 27 EU countries
- `/sales-tax/[state]` – 51 US states + DC
- `/salary/[country]` – 5 countries (US, UK, DE, FR, NL)
- `/finance/compound-interest`
- `/finance/loan-calculator`
- `/finance/fire`

Each page includes:
- Unique `<title>` and `<meta description>`
- H1, intro paragraph, how-it-works content
- FAQ accordion with FAQ schema markup
- BreadcrumbList JSON-LD
- SoftwareApplication JSON-LD
- Canonical URL

---

## Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch
```

Tests cover all calculator logic:
- VAT calculations (6 tests)
- Sales tax calculations (5 tests)
- Compound interest calculations (5 tests)
- Loan/mortgage calculations (4 tests)
- FIRE calculations (4 tests)

---

## License

MIT