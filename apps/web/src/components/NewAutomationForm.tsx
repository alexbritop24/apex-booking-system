// apps/web/src/components/NewAutomationForm.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassTopBar from "./GlassTopBar";
import { Check, ChevronLeft, ChevronRight, Clock, Mail, MessageSquareText, Zap } from "lucide-react";

type Channel = "SMS" | "Email";

type Trigger =
  | "BOOKING_CREATED"
  | "BEFORE_APPOINTMENT_24H"
  | "BEFORE_APPOINTMENT_2H"
  | "AFTER_APPOINTMENT_2H";

type Step = 1 | 2 | 3;

type DraftAutomation = {
  name: string;
  channel: Channel;
  trigger: Trigger;
  offsetMinutes: number; // relative time for BEFORE/AFTER triggers, derived
  subject?: string; // email only
  message: string;
};

function ShellCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
      <div className="mb-10">
        <div className="text-xl tracking-tight font-extralight text-neutral-100">{title}</div>
        {subtitle ? (
          <div className="mt-3 text-[13px] font-light text-neutral-300/70 max-w-[920px]">
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[12px] font-light text-neutral-400/90">{label}</div>
      {children}
      {hint ? <div className="text-[11px] font-light text-neutral-500/80">{hint}</div> : null}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={[
        "w-full rounded-2xl px-5 py-4",
        "bg-black/30 border border-neutral-800/40",
        "text-neutral-100 placeholder:text-neutral-600/80",
        "outline-none",
        "transition-all duration-[700ms]",
        "focus:border-neutral-700/60 focus:shadow-[0_0_0_1px_rgba(229,231,235,0.10)]",
      ].join(" ")}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={[
        "w-full rounded-2xl px-5 py-4 resize-none",
        "bg-black/30 border border-neutral-800/40",
        "text-neutral-100 placeholder:text-neutral-600/80",
        "outline-none",
        "transition-all duration-[700ms]",
        "focus:border-neutral-700/60 focus:shadow-[0_0_0_1px_rgba(229,231,235,0.10)]",
      ].join(" ")}
    />
  );
}

function Pill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-5 py-3 rounded-2xl border",
        "text-[13px] tracking-tight font-light",
        "transition-all duration-[700ms]",
        active
          ? "border-neutral-700/50 bg-neutral-950/40 text-neutral-100 shadow-[0_0_0_1px_rgba(229,231,235,0.10)]"
          : "border-neutral-800/40 bg-black/20 text-neutral-300/70 hover:scale-[1.02] hover:border-neutral-700/40 hover:bg-neutral-950/30",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PrimaryCTA({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4",
        "text-black text-[14px] tracking-tight font-light",
        "transition-all duration-[700ms]",
        "bg-gradient-to-b from-neutral-100 to-neutral-300",
        "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.20)]",
        "disabled:opacity-60 disabled:hover:scale-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-2xl px-6 py-4",
        "border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm",
        "text-neutral-200 text-[14px] tracking-tight font-light",
        "transition-all duration-[700ms]",
        "hover:scale-[1.02] hover:border-neutral-700/40 hover:bg-neutral-950/30",
        "hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Trigger" },
    { n: 2, label: "Message" },
    { n: 3, label: "Review" },
  ] as const;

  return (
    <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm p-8">
      <div className="flex items-center justify-between gap-6">
        {items.map((it, idx) => {
          const active = step === it.n;
          const done = step > it.n;
          return (
            <div key={it.n} className="flex-1">
              <div className="flex items-center gap-4">
                <div
                  className={[
                    "h-10 w-10 rounded-2xl border flex items-center justify-center",
                    "transition-all duration-[700ms]",
                    done
                      ? "border-neutral-700/50 bg-neutral-950/40 text-neutral-100"
                      : active
                      ? "border-neutral-700/50 bg-neutral-950/40 text-neutral-100 shadow-[0_0_0_1px_rgba(229,231,235,0.10)]"
                      : "border-neutral-800/40 bg-black/20 text-neutral-500",
                  ].join(" ")}
                >
                  {done ? <Check className="w-5 h-5" /> : <span className="text-[13px] font-light">{it.n}</span>}
                </div>

                <div className="min-w-0">
                  <div
                    className={[
                      "text-[13px] tracking-tight font-light",
                      active ? "text-neutral-100" : done ? "text-neutral-200" : "text-neutral-400/70",
                    ].join(" ")}
                  >
                    {it.label}
                  </div>
                </div>
              </div>

              {idx < items.length - 1 ? (
                <div className="mt-6 h-px bg-neutral-800/40" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function triggerToOffsetMinutes(t: Trigger) {
  switch (t) {
    case "BEFORE_APPOINTMENT_24H":
      return -24 * 60;
    case "BEFORE_APPOINTMENT_2H":
      return -2 * 60;
    case "AFTER_APPOINTMENT_2H":
      return 2 * 60;
    case "BOOKING_CREATED":
    default:
      return 0;
  }
}

function triggerLabel(t: Trigger) {
  switch (t) {
    case "BOOKING_CREATED":
      return "When a booking is created";
    case "BEFORE_APPOINTMENT_24H":
      return "24 hours before appointment";
    case "BEFORE_APPOINTMENT_2H":
      return "2 hours before appointment";
    case "AFTER_APPOINTMENT_2H":
      return "2 hours after appointment ends";
  }
}

export default function NewAutomationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  const [draft, setDraft] = useState<DraftAutomation>({
    name: "Appointment reminder",
    channel: "SMS",
    trigger: "BEFORE_APPOINTMENT_24H",
    offsetMinutes: triggerToOffsetMinutes("BEFORE_APPOINTMENT_24H"),
    subject: "Appointment reminder",
    message:
      "Hi {clientFirstName} — this is a reminder for your {serviceName} on {date} at {time}. Reply YES to confirm.",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStep1Valid = useMemo(() => {
    return draft.name.trim().length >= 3 && !!draft.channel && !!draft.trigger;
  }, [draft]);

  const isStep2Valid = useMemo(() => {
    if (draft.channel === "Email") {
      return (draft.subject ?? "").trim().length >= 3 && draft.message.trim().length >= 10;
    }
    return draft.message.trim().length >= 10;
  }, [draft]);

  const canContinue = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : true;

  function next() {
    if (!canContinue) return;
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }

  function back() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function createAutomation() {
    setError(null);
    setSaving(true);

    try {
      // Assumption: Firestore write will be added after businessId + schema wiring.
      // For now we simulate success and return to list.
      await new Promise((r) => setTimeout(r, 500));
      navigate("/automations");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create automation.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <GlassTopBar
        title="Create automation"
        subtitle="Set it once. Protect revenue. Follow up automatically."
      />

      <div className="max-w-[1600px] mx-auto px-12 py-12 space-y-12">
        {/* Stepper */}
        <Stepper step={step} />

        {/* Guidance / proof */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-[12px] font-light text-neutral-400/90">Recommended baseline</div>
            <div className="mt-4 text-3xl tracking-tight font-extralight text-neutral-100">
              Start with reminders
            </div>
            <p className="mt-6 text-[13px] font-light text-neutral-300/70 max-w-[920px]">
              Assumption: A 24-hour reminder + a 2-hour reminder reduces no-shows without irritating clients.
              Keep messaging short, specific, and easy to confirm.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-[12px] font-light text-neutral-400/90">Placeholders supported</div>
            <ul className="mt-6 space-y-3 text-[13px] font-light text-neutral-300/80">
              <li>• {"{clientFirstName}"}</li>
              <li>• {"{serviceName}"}</li>
              <li>• {"{date}"} / {"{time}"}</li>
              <li>• {"{businessName}"}</li>
            </ul>
          </div>
        </section>

        {/* Step content */}
        {step === 1 ? (
          <ShellCard
            title="Step 1 — Trigger"
            subtitle="Choose when the message should send. Keep the first automation simple."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Field label="Automation name" hint="Client-facing systems stay calm when names are clear.">
                <Input
                  value={draft.name}
                  onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
                  placeholder="e.g. Appointment reminder (24h)"
                />
              </Field>

              <div className="space-y-2">
                <div className="text-[12px] font-light text-neutral-400/90">Channel</div>
                <div className="flex flex-wrap gap-3">
                  <Pill
                    active={draft.channel === "SMS"}
                    label="SMS"
                    onClick={() => setDraft((d) => ({ ...d, channel: "SMS" }))}
                  />
                  <Pill
                    active={draft.channel === "Email"}
                    label="Email"
                    onClick={() => setDraft((d) => ({ ...d, channel: "Email" }))}
                  />
                </div>
                <div className="text-[11px] font-light text-neutral-500/80">
                  SMS is best for reminders. Email is best for follow-ups.
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-[12px] font-light text-neutral-400/90">Trigger</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Pill
                    active={draft.trigger === "BOOKING_CREATED"}
                    label="On booking created"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        trigger: "BOOKING_CREATED",
                        offsetMinutes: triggerToOffsetMinutes("BOOKING_CREATED"),
                      }))
                    }
                  />
                  <Pill
                    active={draft.trigger === "BEFORE_APPOINTMENT_24H"}
                    label="24h before"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        trigger: "BEFORE_APPOINTMENT_24H",
                        offsetMinutes: triggerToOffsetMinutes("BEFORE_APPOINTMENT_24H"),
                      }))
                    }
                  />
                  <Pill
                    active={draft.trigger === "BEFORE_APPOINTMENT_2H"}
                    label="2h before"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        trigger: "BEFORE_APPOINTMENT_2H",
                        offsetMinutes: triggerToOffsetMinutes("BEFORE_APPOINTMENT_2H"),
                      }))
                    }
                  />
                  <Pill
                    active={draft.trigger === "AFTER_APPOINTMENT_2H"}
                    label="2h after"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        trigger: "AFTER_APPOINTMENT_2H",
                        offsetMinutes: triggerToOffsetMinutes("AFTER_APPOINTMENT_2H"),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="w-5 h-5 text-neutral-200" />
                  </div>
                  <div>
                    <div className="text-[13px] font-light text-neutral-100">Summary</div>
                    <div className="mt-1 text-[12px] font-light text-neutral-400/80">
                      {triggerLabel(draft.trigger)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 text-[12px] font-light text-neutral-300/80">
                  <div className="flex items-center gap-2">
                    {draft.channel === "SMS" ? (
                      <MessageSquareText className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-neutral-400" />
                    )}
                    <span>{draft.channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span>
                      Offset:{" "}
                      {draft.offsetMinutes === 0
                        ? "Immediate"
                        : draft.offsetMinutes < 0
                        ? `${Math.abs(draft.offsetMinutes)} minutes before`
                        : `${draft.offsetMinutes} minutes after`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ShellCard>
        ) : null}

        {step === 2 ? (
          <ShellCard
            title="Step 2 — Message"
            subtitle="Write the message. Keep it short and specific. Give the client one clear action."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {draft.channel === "Email" ? (
                <Field label="Email subject" hint="Clear subjects get opened. Avoid marketing language.">
                  <Input
                    value={draft.subject ?? ""}
                    onChange={(v) => setDraft((d) => ({ ...d, subject: v }))}
                    placeholder="e.g. Reminder: your appointment tomorrow"
                  />
                </Field>
              ) : (
                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                  <div className="text-[13px] font-light text-neutral-100">SMS guidance</div>
                  <p className="mt-3 text-[12px] font-light text-neutral-400/80">
                    Keep it under ~160–240 characters. Include date/time and a confirmation action.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                <div className="text-[13px] font-light text-neutral-100">Preview rules</div>
                <ul className="mt-4 space-y-2 text-[12px] font-light text-neutral-400/80">
                  <li>• No emojis by default (calm, premium)</li>
                  <li>• One clear action (“Reply YES”)</li>
                  <li>• Use placeholders to avoid manual edits</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Field
                label="Message"
                hint="Use placeholders: {clientFirstName}, {serviceName}, {date}, {time}, {businessName}"
              >
                <TextArea
                  value={draft.message}
                  onChange={(v) => setDraft((d) => ({ ...d, message: v }))}
                  placeholder="Write the message your client will receive…"
                  rows={7}
                />
              </Field>

              <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm p-10">
                <div className="text-[12px] font-light text-neutral-400/90">Preview (example)</div>
                <div className="mt-6 rounded-2xl border border-neutral-800/40 bg-black/30 p-8">
                  <div className="text-[12px] font-light text-neutral-500/80">
                    {draft.channel} preview
                  </div>
                  {draft.channel === "Email" ? (
                    <div className="mt-4 text-[13px] font-light text-neutral-200">
                      <div className="text-neutral-400/80 text-[11px]">Subject</div>
                      <div className="mt-1">{(draft.subject ?? "—") || "—"}</div>
                    </div>
                  ) : null}
                  <div className="mt-5 text-[13px] font-light text-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {draft.message
                      .replaceAll("{clientFirstName}", "Sarah")
                      .replaceAll("{serviceName}", "Facial Treatment")
                      .replaceAll("{date}", "Thursday")
                      .replaceAll("{time}", "3:30 PM")
                      .replaceAll("{businessName}", "Apex Clinic")}
                  </div>
                </div>
              </div>
            </div>
          </ShellCard>
        ) : null}

        {step === 3 ? (
          <ShellCard
            title="Step 3 — Review"
            subtitle="Confirm the details. You can edit later, but start clean."
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 rounded-2xl border border-neutral-800/40 bg-black/20 p-10">
                <div className="text-[12px] font-light text-neutral-400/90">Automation</div>
                <div className="mt-4 text-3xl tracking-tight font-extralight text-neutral-100">
                  {draft.name}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] font-light text-neutral-300/80">
                  <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/20 p-6">
                    <div className="text-[11px] text-neutral-500/80">Trigger</div>
                    <div className="mt-2 text-neutral-200">{triggerLabel(draft.trigger)}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/20 p-6">
                    <div className="text-[11px] text-neutral-500/80">Channel</div>
                    <div className="mt-2 text-neutral-200">{draft.channel}</div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 p-8">
                  <div className="text-[11px] text-neutral-500/80">Message</div>
                  {draft.channel === "Email" ? (
                    <div className="mt-4 text-[12px] font-light text-neutral-400/80">
                      Subject: <span className="text-neutral-200">{draft.subject || "—"}</span>
                    </div>
                  ) : null}
                  <div className="mt-4 text-[13px] font-light text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {draft.message}
                  </div>
                </div>

                {error ? (
                  <div className="mt-8 rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-6 text-[13px] font-light text-neutral-200">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
                <div className="text-[12px] font-light text-neutral-400/90">Impact (assumption)</div>
                <div className="mt-4 text-2xl tracking-tight font-extralight text-neutral-100">
                  Fewer no-shows
                </div>
                <p className="mt-4 text-[13px] font-light text-neutral-300/70">
                  Assumption: Reminders reduce missed appointments and late cancellations.
                  This protects revenue without adding admin work.
                </p>

                <div className="mt-8 space-y-3 text-[12px] font-light text-neutral-400/80">
                  <div>• Start simple</div>
                  <div>• Measure for 7 days</div>
                  <div>• Add follow-ups later</div>
                </div>
              </div>
            </div>
          </ShellCard>
        ) : null}

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-6">
          <div>
            {step > 1 ? (
              <GhostButton onClick={back}>
                <ChevronLeft className="w-4 h-4" />
                Back
              </GhostButton>
            ) : (
              <GhostButton onClick={() => navigate("/automations")}>
                <ChevronLeft className="w-4 h-4" />
                Cancel
              </GhostButton>
            )}
          </div>

          <div className="flex items-center gap-4">
            {step < 3 ? (
              <PrimaryCTA disabled={!canContinue} onClick={next}>
                Continue
                <ChevronRight className="w-4 h-4" />
              </PrimaryCTA>
            ) : (
              <PrimaryCTA disabled={saving || !isStep1Valid || !isStep2Valid} onClick={createAutomation}>
                {saving ? "Creating…" : "Create automation"}
              </PrimaryCTA>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}