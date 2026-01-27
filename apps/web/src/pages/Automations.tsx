// apps/web/src/pages/Automations.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import GlassTopBar from "../components/GlassTopBar";
import { Plus, Zap, MessageSquareText, Mail, Clock } from "lucide-react";

type AutomationStatus = "active" | "paused";

type Automation = {
  id: string;
  name: string;
  status: AutomationStatus;
  trigger: string;
  channel: "SMS" | "Email";
  timing: string;
};

function StatusPill({ status }: { status: AutomationStatus }) {
  const base =
    "px-3 py-1 rounded-full text-[11px] font-light border transition-all duration-[700ms]";

  if (status === "active") {
    return (
      <span className={`${base} border-neutral-700/40 text-neutral-200 bg-neutral-950/40`}>
        Active
      </span>
    );
  }

  return (
    <span className={`${base} border-neutral-900/40 text-neutral-500 bg-black/20`}>
      Paused
    </span>
  );
}

function ChannelIcon({ channel }: { channel: "SMS" | "Email" }) {
  if (channel === "SMS") return <MessageSquareText className="w-4 h-4 text-neutral-400" />;
  return <Mail className="w-4 h-4 text-neutral-400" />;
}

function AutomationRow({ a }: { a: Automation }) {
  return (
    <Link
      to={`/automations/${a.id}`}
      className={[
        "block rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm",
        "px-8 py-7 transition-all duration-[700ms]",
        "hover:scale-[1.01] hover:border-neutral-700/40 hover:bg-neutral-950/40",
        "hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-neutral-800/40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-neutral-200" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] tracking-tight font-light text-neutral-100 truncate">
                {a.name}
              </div>
              <div className="mt-1 text-[12px] font-light text-neutral-400/80 truncate">
                Trigger: {a.trigger}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-[12px] font-light text-neutral-400/90">
            <div className="flex items-center gap-2">
              <ChannelIcon channel={a.channel} />
              <span>{a.channel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <span>{a.timing}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-4">
          <StatusPill status={a.status} />
          <div className="text-[12px] font-light text-neutral-400/70">View →</div>
        </div>
      </div>
    </Link>
  );
}

export default function Automations() {
  const automations: Automation[] = useMemo(
    () => [
      {
        id: "reminder-24h",
        name: "Appointment reminder (24h)",
        status: "active",
        trigger: "24 hours before booking",
        channel: "SMS",
        timing: "Sends 24h before",
      },
      {
        id: "reminder-2h",
        name: "Appointment reminder (2h)",
        status: "active",
        trigger: "2 hours before booking",
        channel: "SMS",
        timing: "Sends 2h before",
      },
      {
        id: "followup-post",
        name: "Post-visit follow-up",
        status: "paused",
        trigger: "2 hours after booking ends",
        channel: "Email",
        timing: "Sends after visit",
      },
    ],
    []
  );

  const hasAutomations = automations.length > 0;

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <GlassTopBar
        title="Automations"
        subtitle="Set it once. Protect revenue. Follow up automatically."
        rightSlot={
          <Link
            to="/automations/new"
            className={[
              "inline-flex items-center gap-2 rounded-2xl px-6 py-4",
              "text-black text-[14px] tracking-tight font-light",
              "transition-all duration-[700ms]",
              "bg-gradient-to-b from-neutral-100 to-neutral-300",
              "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.20)]",
            ].join(" ")}
          >
            <Plus className="w-4 h-4" />
            Create automation
          </Link>
        }
      />

      <div className="max-w-[1600px] mx-auto px-12 py-12 space-y-12">
        {/* Proof module */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-[12px] font-light text-neutral-400/90">
              Revenue protection module
            </div>
            <div className="mt-4 text-3xl md:text-4xl tracking-tight font-extralight text-neutral-100">
              Reduce no-shows with reminders
            </div>
            <p className="mt-6 text-[13px] font-light text-neutral-300/70 max-w-[820px]">
              Assumption: The most effective baseline is a 24h reminder + a 2h reminder.
              This is designed to reduce missed appointments without annoying clients.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-[12px] font-light text-neutral-400/90">Suggested defaults</div>
            <ul className="mt-6 space-y-3 text-[13px] font-light text-neutral-300/80">
              <li>• 24h reminder (SMS)</li>
              <li>• 2h reminder (SMS)</li>
              <li>• Post-visit follow-up (Email)</li>
            </ul>
          </div>
        </section>

        {/* List / Empty */}
        <section className="space-y-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="text-xl tracking-tight font-extralight text-neutral-100">
                Your automations
              </h2>
              <p className="mt-3 text-[13px] font-light text-neutral-300/70">
                Keep this simple: start with reminders, then add follow-ups.
              </p>
            </div>
          </div>

          {hasAutomations ? (
            <div className="space-y-4">
              {automations.map((a) => (
                <AutomationRow key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="text-2xl tracking-tight font-extralight text-neutral-100">
                No automations yet
              </div>
              <p className="mt-4 text-[13px] font-light text-neutral-300/70 max-w-[720px]">
                Start with a reminder automation. It’s the fastest way to reduce no-shows
                and protect revenue.
              </p>
              <div className="mt-8">
                <Link
                  to="/automations/new"
                  className={[
                    "inline-flex items-center gap-2 rounded-2xl px-6 py-4",
                    "text-black text-[14px] tracking-tight font-light",
                    "transition-all duration-[700ms]",
                    "bg-gradient-to-b from-neutral-100 to-neutral-300",
                    "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.20)]",
                  ].join(" ")}
                >
                  <Plus className="w-4 h-4" />
                  Create your first automation
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}