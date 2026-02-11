// apps/web/src/components/BookingRow.tsx
import React from "react";
import { CalendarClock, ChevronRight } from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "cancelled";

type BookingRowProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string; // e.g. "Today · 3:30 PM"
  status: BookingStatus;
  rightSlot?: React.ReactNode; // optional actions (View, Edit, etc.)
};

function StatusPill({ status }: { status: BookingStatus }) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-2.5 py-1 text-[11px] font-semibold tracking-tight border";

  if (status === "confirmed") {
    return (
      <span className={`${base} border-emerald-500/15 bg-emerald-500/10 text-emerald-200/90`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
        Confirmed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className={`${base} border-amber-500/15 bg-amber-500/10 text-amber-200/90`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300/90" />
        Pending
      </span>
    );
  }

  return (
    <span className={`${base} border-white/10 bg-white/5 text-neutral-300/70`}>
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-300/50" />
      Cancelled
    </span>
  );
}

export default function BookingRow({
  clientName,
  serviceName,
  dateLabel,
  status,
  rightSlot,
}: BookingRowProps) {
  return (
    <div
      className={[
        "group relative w-full",
        "rounded-2xl border border-white/[0.06] bg-neutral-950/30 backdrop-blur-sm",
        "px-6 md:px-7 py-5",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        "transition-all duration-[700ms]",
        "hover:bg-neutral-950/45 hover:border-white/[0.10] hover:-translate-y-[1px]",
        "hover:shadow-[0_0_0_1px_rgba(56,189,248,0.10)]",
      ].join(" ")}
    >
      {/* subtle left glow accent */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[700ms]" />

      <div className="relative flex items-center justify-between gap-6">
        <div className="min-w-0 flex items-center gap-4">
          <div className="hidden sm:grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.08] bg-black/30 text-neutral-200 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]">
            <CalendarClock className="h-5 w-5 opacity-90" />
          </div>

          <div className="min-w-0">
            <div className="text-[14px] font-semibold tracking-tight text-neutral-100 truncate">
              {clientName}
            </div>
            <div className="mt-1 text-[12px] text-neutral-400/90 truncate">
              {serviceName}
            </div>

            <div className="mt-2 sm:hidden inline-flex items-center gap-2 text-[12px] text-neutral-400/90">
              <CalendarClock className="h-4 w-4 text-neutral-500" />
              {dateLabel}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[12px] text-neutral-400/90">
          <CalendarClock className="h-4 w-4 text-neutral-500" />
          <span>{dateLabel}</span>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <StatusPill status={status} />

          {rightSlot ? (
            <div className="hidden lg:block">{rightSlot}</div>
          ) : (
            <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition-all duration-[700ms]" />
          )}
        </div>
      </div>
    </div>
  );
}