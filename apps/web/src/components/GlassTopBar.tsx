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
      <div className="border-b border-neutral-800/40 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="py-8 flex items-start justify-between gap-8">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl tracking-tight font-extralight text-neutral-100">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 text-sm md:text-base font-light text-neutral-300/80 max-w-[900px]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {rightSlot ? (
              <div className="shrink-0 flex items-center gap-4">{rightSlot}</div>
            ) : (
              <div className="shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}