// apps/web/src/components/ActivityItem.tsx
import React from "react";

type ActivityItemProps = {
  title: string;        // e.g. "Reminder sent"
  description?: string; // e.g. "SMS reminder delivered to client"
  timeLabel: string;    // e.g. "2 minutes ago"
};

export default function ActivityItem({
  title,
  description,
  timeLabel,
}: ActivityItemProps) {
  return (
    <div
      className={[
        "w-full flex items-start justify-between gap-6",
        "rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm",
        "px-8 py-6 transition-all duration-[700ms]",
        "hover:scale-[1.01] hover:border-neutral-700/40 hover:bg-neutral-950/40",
        "hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-[14px] tracking-tight font-light text-neutral-100">
          {title}
        </div>
        {description ? (
          <div className="mt-1 text-[12px] font-light text-neutral-400/80">
            {description}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-[11px] font-light text-neutral-500/80">
        {timeLabel}
      </div>
    </div>
  );
}