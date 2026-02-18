import { cn } from '@/lib/utils';
import { getAdSlotConfig } from '@/lib/ads';
import DOMPurify from 'isomorphic-dompurify';

interface AdSlotProps {
  slot: 'top-banner' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SIZES: Record<string, string> = {
  'top-banner': 'min-h-[90px] max-w-[728px] mx-auto',
  sidebar: 'min-h-[250px] w-full max-w-[300px]',
  'in-content': 'min-h-[250px] max-w-[728px] mx-auto',
  footer: 'min-h-[90px] max-w-[728px] mx-auto',
};

/**
 * Server-rendered ad slot.
 * Reads config from DB, renders AdSense tags or sanitized custom HTML.
 * CLS-safe: preserves minimum height even if ad blocked.
 */
export async function AdSlot({ slot, className }: AdSlotProps) {
  const config = await getAdSlotConfig(slot);

  // Slot disabled → render nothing visible but keep layout stable
  if (!config.enabled) {
    return null;
  }

  // AdSense mode
  if (config.provider === 'adsense' && config.adsenseClientId && config.adsenseSlotId) {
    return (
      <aside
        className={cn('flex items-center justify-center my-4', SIZES[slot], className)}
        aria-label="Advertisement"
        data-ad-slot={slot}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={config.adsenseClientId}
          data-ad-slot={config.adsenseSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(config.nonPersonalizedDefault ? { 'data-npa': '1' } : {})}
        />
      </aside>
    );
  }

  // Custom HTML mode – sanitize aggressively
  if (config.provider === 'custom' && config.customHtml) {
    const clean = DOMPurify.sanitize(config.customHtml, {
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'a', 'img', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u',
        'ul', 'ol', 'li', 'figure', 'figcaption', 'picture', 'source', 'iframe',
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'width', 'height', 'target', 'rel',
        'class', 'style', 'loading', 'referrerpolicy', 'sandbox', 'allow',
        'frameborder', 'scrolling',
      ],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
    });

    if (!clean.trim()) {
      // Sanitization stripped everything → fallback placeholder
      return (
        <aside
          className={cn('flex items-center justify-center my-4', SIZES[slot], className)}
          aria-label="Advertisement"
          data-ad-slot={slot}
        >
          <div className="w-full h-full bg-muted/20 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center text-xs text-muted-foreground/40">
            Ad Space
          </div>
        </aside>
      );
    }

    return (
      <aside
        className={cn('flex items-center justify-center my-4', SIZES[slot], className)}
        aria-label="Advertisement"
        data-ad-slot={slot}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  // Fallback placeholder
  return (
    <aside
      className={cn('flex items-center justify-center my-4', SIZES[slot], className)}
      aria-label="Advertisement"
      data-ad-slot={slot}
    >
      <div className="w-full h-full bg-muted/20 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center text-xs text-muted-foreground/40">
        Ad Space
      </div>
    </aside>
  );
}
