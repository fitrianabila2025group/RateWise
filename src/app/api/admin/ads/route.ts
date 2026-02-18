import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { requireAdmin } from '@/lib/require-admin';
import { z } from 'zod';

/** All ad-config keys stored in SiteSetting with an "ads." prefix. */
const ADS_PREFIX = 'ads.';

const adsConfigSchema = z.object({
  enableTopBanner: z.boolean(),
  enableSidebar: z.boolean(),
  enableInContent: z.boolean(),
  enableFooter: z.boolean(),
  adProvider: z.enum(['adsense', 'custom']),
  adsenseClientId: z.string(),
  adsenseSlotTopBanner: z.string(),
  adsenseSlotSidebar: z.string(),
  adsenseSlotInContent: z.string(),
  adsenseSlotFooter: z.string(),
  customAdHtmlTopBanner: z.string(),
  customAdHtmlSidebar: z.string(),
  customAdHtmlInContent: z.string(),
  customAdHtmlFooter: z.string(),
  globalHeadScript: z.string(),
  globalBodyScript: z.string(),
  nonPersonalizedAdsDefault: z.boolean(),
});

export type AdsConfig = z.infer<typeof adsConfigSchema>;

const ADS_KEYS: (keyof AdsConfig)[] = [
  'enableTopBanner',
  'enableSidebar',
  'enableInContent',
  'enableFooter',
  'adProvider',
  'adsenseClientId',
  'adsenseSlotTopBanner',
  'adsenseSlotSidebar',
  'adsenseSlotInContent',
  'adsenseSlotFooter',
  'customAdHtmlTopBanner',
  'customAdHtmlSidebar',
  'customAdHtmlInContent',
  'customAdHtmlFooter',
  'globalHeadScript',
  'globalBodyScript',
  'nonPersonalizedAdsDefault',
];

function deserialize(key: keyof AdsConfig, value: string): boolean | string {
  if (
    key === 'enableTopBanner' ||
    key === 'enableSidebar' ||
    key === 'enableInContent' ||
    key === 'enableFooter' ||
    key === 'nonPersonalizedAdsDefault'
  ) {
    return value === 'true';
  }
  return value;
}

function serialize(value: boolean | string): string {
  return String(value);
}

/** GET /api/admin/ads – return current ads config */
export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: ADS_PREFIX } },
  });

  const map = new Map(rows.map((r) => [r.key.replace(ADS_PREFIX, ''), r.value]));

  const config: Record<string, boolean | string> = {};
  for (const k of ADS_KEYS) {
    const raw = map.get(k) ?? '';
    config[k] = deserialize(k, raw);
  }

  return NextResponse.json(config);
}

/** PUT /api/admin/ads – update ads config */
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const data = adsConfigSchema.parse(body);

    for (const k of ADS_KEYS) {
      const dbKey = `${ADS_PREFIX}${k}`;
      const val = serialize(data[k]);
      await prisma.siteSetting.upsert({
        where: { key: dbKey },
        update: { value: val },
        create: { key: dbKey, value: val },
      });
    }

    await logAudit('UPDATE', 'AdsConfig');
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update ads config' }, { status: 500 });
  }
}
