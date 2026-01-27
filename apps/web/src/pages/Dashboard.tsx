// apps/web/src/pages/Dashboard.tsx
import React from "react";
import GlassTopBar from "../components/GlassTopBar";
import StatCard from "../components/StatCard";
import BookingRow from "../components/BookingRow";
import ActivityItem from "../components/ActivityItem";
import { Calendar, Users, Zap, Shield } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <GlassTopBar
        title="Dashboard"
        subtitle="A calm overview of your revenue, activity, and automation health."
      />

      <div className="max-w-[1600px] mx-auto px-12 py-12 space-y-12">
        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
        <section className="space-y-8">
          <h2 className="text-xl tracking-tight font-extralight text-neutral-100">
            Proven outcomes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="text-sm font-light text-neutral-400">
                Automated reminders
              </div>
              <div className="mt-4 text-3xl font-extralight tracking-tight text-neutral-100">
                −38% no-shows
              </div>
              <p className="mt-6 text-[13px] font-light text-neutral-300/70">
                Assumption: SMS + email reminders sent 24h and 2h before
                appointments reduced missed bookings for service businesses.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="text-sm font-light text-neutral-400">
                Deposit enforcement
              </div>
              <div className="mt-4 text-3xl font-extralight tracking-tight text-neutral-100">
                +$1.2k / mo
              </div>
              <p className="mt-6 text-[13px] font-light text-neutral-300/70">
                Assumption: Requiring deposits protected revenue from late
                cancellations.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="text-sm font-light text-neutral-400">
                Automated follow-ups
              </div>
              <div className="mt-4 text-3xl font-extralight tracking-tight text-neutral-100">
                +21% rebooks
              </div>
              <p className="mt-6 text-[13px] font-light text-neutral-300/70">
                Assumption: Post-appointment follow-ups increased repeat visits.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming bookings + activity */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg tracking-tight font-extralight text-neutral-100">
              Upcoming bookings
            </h3>

            <div className="space-y-4">
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

          <div className="space-y-6">
            <h3 className="text-lg tracking-tight font-extralight text-neutral-100">
              Recent activity
            </h3>

            <div className="space-y-4">
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