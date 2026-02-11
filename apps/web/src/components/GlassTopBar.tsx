// apps/web/src/components/GlassTopBar.tsx
import React from "react";

type GlassTopBarProps = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

export default function GlassTopBar({ title, subtitle, rightSlot }: GlassTopBarProps) {
  return (
    <div className="sticky top-0 z-40">
      {/* Glass surface */}
      <div className="relative border-b border-white/[0.06] bg-neutral-950/60 backdrop-blur-xl">
        {/* subtle top sheen + bottom fade (adds “product” feel) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_30%_0%,rgba(56,189,248,0.08),transparent_55%)]" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="py-5 md:py-6 flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-[26px] md:text-[34px] leading-tight tracking-[-0.03em] font-semibold text-neutral-100 truncate">
                {title}
              </h1>

              {subtitle ? (
                <p className="mt-1.5 text-[13px] md:text-[14px] leading-relaxed text-neutral-400/90 max-w-[920px]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {rightSlot ? (
              <div className="shrink-0 flex items-center gap-3">{rightSlot}</div>
            ) : (
              <div className="shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}