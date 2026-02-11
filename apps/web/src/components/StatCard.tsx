// apps/web/src/components/StatCard.tsx
import React from "react";

type Trend = {
  label: string; // e.g. "Last 7 days"
  value: string; // e.g. "+12%"
};

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: Trend;
  icon?: React.ReactNode;
};

function getTrendTone(trendValue: string) {
  const v = trendValue.trim();
  if (v.startsWith("-")) return "text-rose-200/90 border-rose-500/15 bg-rose-500/10";
  if (v.startsWith("+")) return "text-emerald-200/90 border-emerald-500/15 bg-emerald-500/10";
  return "text-neutral-200/80 border-white/10 bg-white/5";
}

export default function StatCard({ label, value, hint, trend, icon }: StatCardProps) {
  const trendTone = trend ? getTrendTone(trend.value) : "";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl p-7 md:p-8",
        "border border-white/[0.06] bg-neutral-950/30 backdrop-blur-sm",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        "transition-all duration-[700ms]",
        "hover:bg-neutral-950/45 hover:border-white/[0.10]",
        "hover:shadow-[0_0_0_1px_rgba(56,189,248,0.10)] hover:-translate-y-[1px]",
      ].join(" ")}
    >
      {/* subtle top glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[12px] font-medium tracking-wide text-neutral-400/90">
            {label}
          </div>

          <div className="mt-3 text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-neutral-100">
            {value}
          </div>

          {hint ? (
            <div className="mt-2.5 text-[13px] leading-relaxed text-neutral-400/90 max-w-[360px]">
              {hint}
            </div>
          ) : null}
        </div>

        {icon ? (
          <div
            className={[
              "shrink-0 h-11 w-11 rounded-2xl",
              "border border-white/[0.08]",
              "bg-black/30 backdrop-blur-sm",
              "grid place-items-center text-neutral-200",
              "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]",
            ].join(" ")}
          >
            {icon}
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className="relative mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between gap-6">
          <div className="text-[11px] font-medium tracking-wide text-neutral-500/90">
            {trend.label}
          </div>

          <div
            className={[
              "text-[12px] font-semibold tracking-tight",
              "px-2.5 py-1 rounded-xl border",
              trendTone,
            ].join(" ")}
          >
            {trend.value}
          </div>
        </div>
      ) : null}
    </div>
  );
}