import { prisma } from '@/lib/db';

export interface AdSlotConfig {
  enabled: boolean;
  provider: 'adsense' | 'custom';
  adsenseClientId: string;
  adsenseSlotId: string;
  customHtml: string;
  nonPersonalizedDefault: boolean;
}

const SLOT_KEY_MAP: Record<string, { enable: string; adsenseSlot: string; customHtml: string }> = {
  'top-banner': {
    enable: 'ads.enableTopBanner',
    adsenseSlot: 'ads.adsenseSlotTopBanner',
    customHtml: 'ads.customAdHtmlTopBanner',
  },
  sidebar: {
    enable: 'ads.enableSidebar',
    adsenseSlot: 'ads.adsenseSlotSidebar',
    customHtml: 'ads.customAdHtmlSidebar',
  },
  'in-content': {
    enable: 'ads.enableInContent',
    adsenseSlot: 'ads.adsenseSlotInContent',
    customHtml: 'ads.customAdHtmlInContent',
  },
  footer: {
    enable: 'ads.enableFooter',
    adsenseSlot: 'ads.adsenseSlotFooter',
    customHtml: 'ads.customAdHtmlFooter',
  },
};

/**
 * Load ad configuration for a specific slot from the database.
 * Called server-side only.
 */
export async function getAdSlotConfig(
  slot: 'top-banner' | 'sidebar' | 'in-content' | 'footer',
): Promise<AdSlotConfig> {
  const defaults: AdSlotConfig = {
    enabled: false,
    provider: 'adsense',
    adsenseClientId: '',
    adsenseSlotId: '',
    customHtml: '',
    nonPersonalizedDefault: true,
  };

  try {
    const keys = SLOT_KEY_MAP[slot];
    if (!keys) return defaults;

    const neededKeys = [
      keys.enable,
      keys.adsenseSlot,
      keys.customHtml,
      'ads.adProvider',
      'ads.adsenseClientId',
      'ads.nonPersonalizedAdsDefault',
    ];

    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: neededKeys } },
    });

    const map = new Map(rows.map((r) => [r.key, r.value]));

    return {
      enabled: map.get(keys.enable) === 'true',
      provider: (map.get('ads.adProvider') as 'adsense' | 'custom') || 'adsense',
      adsenseClientId: map.get('ads.adsenseClientId') || '',
      adsenseSlotId: map.get(keys.adsenseSlot) || '',
      customHtml: map.get(keys.customHtml) || '',
      nonPersonalizedDefault: map.get('ads.nonPersonalizedAdsDefault') !== 'false',
    };
  } catch {
    return defaults;
  }
}
