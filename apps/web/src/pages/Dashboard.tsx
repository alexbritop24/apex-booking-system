// apps/web/src/pages/Dashboard.tsx
import React from "react";
import GlassTopBar from "../components/GlassTopBar";
import StatCard from "../components/StatCard";
import BookingRow from "../components/BookingRow";
import ActivityItem from "../components/ActivityItem";
import { Calendar, Users, Zap, Shield, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <GlassTopBar
        title="Dashboard"
        subtitle="A calm overview of your revenue, activity, and automation health."
        rightSlot={
          <button
            className={[
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5",
              "text-[13px] font-medium text-neutral-900",
              "bg-gradient-to-b from-neutral-100 to-neutral-300",
              "transition-all duration-[700ms]",
              "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.20)]",
            ].join(" ")}
            type="button"
          >
            View revenue
            <ArrowUpRight className="h-4 w-4" />
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10 space-y-10">
        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7">
          <StatCard
            label="Upcoming bookings"
            value="18"
            hint="Scheduled over the next 7 days"
            trend={{ label: "Last 7 days", value: "+12%" }}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            label="Monthly revenue"
            value="$6,420"
            hint="Protected from no-shows and late cancellations"
            trend={{ label: "vs last month", value: "+9%" }}
            icon={<Shield className="w-5 h-5" />}
          />
          <StatCard
            label="Active clients"
            value="214"
            hint="Clients with at least one booking in the last 90 days"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Automations running"
            value="5"
            hint="Reminders, follow-ups, and confirmations"
            icon={<Zap className="w-5 h-5" />}
          />
        </section>

        {/* Proof modules */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[16px] md:text-[18px] tracking-tight font-semibold text-neutral-100">
              Proven outcomes
            </h2>
            <div className="text-[12px] text-neutral-500/90">
              Benchmarks shown as assumptions until you connect real data.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {[
              {
                label: "Automated reminders",
                value: "−38% no-shows",
                body:
                  "Assumption: SMS + email reminders sent 24h and 2h before appointments reduced missed bookings for service businesses.",
              },
              {
                label: "Deposit enforcement",
                value: "+$1.2k / mo",
                body:
                  "Assumption: Requiring deposits protected revenue from late cancellations.",
              },
              {
                label: "Automated follow-ups",
                value: "+21% rebooks",
                body:
                  "Assumption: Post-appointment follow-ups increased repeat visits.",
              },
            ].map((card) => (
              <div
                key={card.label}
                className={[
                  "group rounded-2xl p-8 md:p-9",
                  "border border-white/[0.06]",
                  "bg-neutral-950/35 backdrop-blur-sm",
                  "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
                  "transition-all duration-[700ms]",
                  "hover:bg-neutral-950/45 hover:border-white/[0.10] hover:shadow-[0_0_0_1px_rgba(56,189,248,0.10)]",
                ].join(" ")}
              >
                <div className="text-[12px] font-medium text-neutral-400/90 tracking-wide">
                  {card.label}
                </div>
                <div className="mt-3 text-[26px] md:text-[28px] font-semibold tracking-[-0.02em] text-neutral-100">
                  {card.value}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-neutral-400/90">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming bookings + activity */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
          <div className="rounded-2xl border border-white/[0.06] bg-neutral-950/30 backdrop-blur-sm p-7 md:p-8">
            <div className="flex items-center justify-between gap-6">
              <h3 className="text-[15px] md:text-[16px] font-semibold tracking-tight text-neutral-100">
                Upcoming bookings
              </h3>
              <button
                type="button"
                className="text-[12px] font-medium text-neutral-300/80 hover:text-neutral-100 transition-all duration-[700ms]"
              >
                View all →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <BookingRow
                clientName="Alex Johnson"
                serviceName="Skin treatment · 60 min"
                dateLabel="Today · 3:30 PM"
                status="confirmed"
              />
              <BookingRow
                clientName="Maria Lopez"
                serviceName="Haircut · 45 min"
                dateLabel="Tomorrow · 11:00 AM"
                status="pending"
              />
              <BookingRow
                clientName="Chris Park"
                serviceName="Consultation · 30 min"
                dateLabel="Fri · 2:00 PM"
                status="confirmed"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-neutral-950/30 backdrop-blur-sm p-7 md:p-8">
            <div className="flex items-center justify-between gap-6">
              <h3 className="text-[15px] md:text-[16px] font-semibold tracking-tight text-neutral-100">
                Recent activity
              </h3>
              <div className="text-[12px] text-neutral-500/90">Last 24h</div>
            </div>

            <div className="mt-5 space-y-3">
              <ActivityItem
                title="Reminder sent"
                description="SMS reminder delivered to Alex Johnson"
                timeLabel="2 minutes ago"
              />
              <ActivityItem
                title="Booking created"
                description="Maria Lopez booked Haircut"
                timeLabel="1 hour ago"
              />
              <ActivityItem
                title="Follow-up sent"
                description="Post-visit follow-up delivered"
                timeLabel="Yesterday"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}