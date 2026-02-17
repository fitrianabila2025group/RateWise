import { cn } from '@/lib/utils';

interface AdSlotProps {
  slot: 'top-banner' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

/**
 * Ad placeholder component. Replace the inner div with your ad network code.
 * Falls back gracefully if ads are blocked — no layout shift.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  const sizes: Record<string, string> = {
    'top-banner': 'min-h-[90px] max-w-[728px] mx-auto',
    sidebar: 'min-h-[250px] w-full max-w-[300px]',
    'in-content': 'min-h-[250px] max-w-[728px] mx-auto',
    footer: 'min-h-[90px] max-w-[728px] mx-auto',
  };

  return (
    <aside
      className={cn('flex items-center justify-center my-4', sizes[slot], className)}
      aria-label="Advertisement"
      data-ad-slot={slot}
    >
      {/* Replace with your ad network script/tag */}
      <div className="w-full h-full bg-muted/20 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center text-xs text-muted-foreground/40">
        Ad Space
      </div>
    </aside>
  );
}
