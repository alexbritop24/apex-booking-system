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

export default function StatCard({ label, value, hint, trend, icon }: StatCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm",
        "p-10 transition-all duration-[700ms]",
        "hover:scale-[1.02] hover:border-neutral-700/40 hover:bg-neutral-950/40",
        "hover:shadow-[0_0_0_1px_rgba(229,231,235,0.10)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[12px] tracking-tight font-light text-neutral-400/90">
            {label}
          </div>
          <div className="mt-5 text-3xl md:text-4xl tracking-tight font-extralight text-neutral-100">
            {value}
          </div>

          {hint ? (
            <div className="mt-4 text-[13px] font-light text-neutral-300/70 max-w-[320px]">
              {hint}
            </div>
          ) : null}
        </div>

        {icon ? (
          <div className="shrink-0 h-12 w-12 rounded-2xl border border-neutral-800/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-neutral-200">
            {icon}
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className="mt-8 pt-6 border-t border-neutral-800/40 flex items-center justify-between gap-6">
          <div className="text-[11px] text-neutral-500/90 font-light">{trend.label}</div>
          <div className="text-[12px] text-neutral-200 font-light">{trend.value}</div>
        </div>
      ) : null}
    </div>
  );
}