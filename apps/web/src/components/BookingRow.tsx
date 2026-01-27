// apps/web/src/components/BookingRow.tsx
import React from "react";
import { CalendarClock } from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "cancelled";

type BookingRowProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string; // e.g. "Today · 3:30 PM"
  status: BookingStatus;
};

function StatusPill({ status }: { status: BookingStatus }) {
  const base =
    "px-3 py-1 rounded-full text-[11px] font-light border transition-all duration-[700ms]";

  if (status === "confirmed") {
    return (
      <span
        className={`${base} border-neutral-700/40 text-neutral-200 bg-neutral-950/40`}
      >
        Confirmed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span
        className={`${base} border-neutral-800/40 text-neutral-300 bg-neutral-950/20`}
      >
        Pending
      </span>
    );
  }

  return (
    <span
      className={`${base} border-neutral-900/40 text-neutral-500 bg-black/20`}
    >
      Cancelled
    </span>
  );
}

export default function BookingRow({
  clientName,
  serviceName,
  dateLabel,
  status,
}: BookingRowProps) {
  return (
    <div
      className={[
        "w-full flex items-center justify-between gap-6",
        "rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm",
        "px-8 py-6 transition-all duration-[700ms]",
        "hover:scale-[1.01] hover:border-neutral-700/40 hover:bg-neutral-950/40",
        "hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-[14px] font-light tracking-tight text-neutral-100 truncate">
          {clientName}
        </div>
        <div className="mt-1 text-[12px] font-light text-neutral-400/80 truncate">
          {serviceName}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[12px] text-neutral-400/90 font-light">
        <CalendarClock className="w-4 h-4 text-neutral-500" />
        {dateLabel}
      </div>

      <div className="shrink-0">
        <StatusPill status={status} />
      </div>
    </div>
  );
}