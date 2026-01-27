// apps/web/src/pages/PublicBooking.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarClock, Check, ChevronLeft, ChevronRight, Shield } from "lucide-react";

type Step = 1 | 2 | 3;

type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type Slot = {
  id: string;
  label: string; // e.g. "Today · 3:30 PM"
  iso: string; // e.g. "2026-01-26T15:30:00-07:00"
};

type BookingDraft = {
  businessId: string;
  serviceId: string | null;
  slotId: string | null;
  clientName: string;
  clientPhoneOrEmail: string;
  notes: string;
};

function PrimaryCTA({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
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
  rows = 4,
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

function SelectCard({
  active,
  title,
  subtitle,
  right,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-8",
        "transition-all duration-[700ms]",
        active
          ? "border-neutral-700/50 bg-neutral-950/40 shadow-[0_0_0_1px_rgba(229,231,235,0.10)]"
          : "border-neutral-800/40 bg-neutral-950/20 hover:scale-[1.01] hover:border-neutral-700/40 hover:bg-neutral-950/30 hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[15px] tracking-tight font-light text-neutral-100">{title}</div>
          {subtitle ? (
            <div className="mt-2 text-[12px] font-light text-neutral-400/80">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </button>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Service" },
    { n: 2, label: "Time" },
    { n: 3, label: "Confirm" },
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

              {idx < items.length - 1 ? <div className="mt-6 h-px bg-neutral-800/40" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PublicBooking() {
  const { businessId } = useParams<{ businessId: string }>();

  const sessionKey = useMemo(() => {
    return businessId ? `apex_booking_public_${businessId}` : "apex_booking_public_unknown";
  }, [businessId]);

  // Assumption: business info is fetched by businessId later.
  const businessName = useMemo(() => "Apex Partner Business", []);

  const services: Service[] = useMemo(
    () => [
      { id: "svc-1", name: "Haircut", durationMin: 45, price: 45 },
      { id: "svc-2", name: "Facial Treatment", durationMin: 60, price: 120 },
      { id: "svc-3", name: "Consultation", durationMin: 30, price: 0 },
    ],
    []
  );

  const slots: Slot[] = useMemo(
    () => [
      { id: "slot-1", label: "Today · 3:30 PM", iso: "2026-01-26T15:30:00-07:00" },
      { id: "slot-2", label: "Tomorrow · 11:00 AM", iso: "2026-01-27T11:00:00-07:00" },
      { id: "slot-3", label: "Thu · 2:00 PM", iso: "2026-01-29T14:00:00-07:00" },
      { id: "slot-4", label: "Fri · 10:30 AM", iso: "2026-01-30T10:30:00-07:00" },
    ],
    []
  );

  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<BookingDraft>(() => {
    const initial: BookingDraft = {
      businessId: businessId ?? "",
      serviceId: null,
      slotId: null,
      clientName: "",
      clientPhoneOrEmail: "",
      notes: "",
    };

    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (!raw) return initial;
      const parsed = JSON.parse(raw) as Partial<BookingDraft>;
      return {
        ...initial,
        ...parsed,
        businessId: businessId ?? parsed.businessId ?? "",
      };
    } catch {
      return initial;
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Keep session in sync.
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft, sessionKey]);

  useEffect(() => {
    // If route param changes, update draft businessId.
    if (businessId && draft.businessId !== businessId) {
      setDraft((d) => ({ ...d, businessId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === draft.serviceId) ?? null,
    [services, draft.serviceId]
  );
  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === draft.slotId) ?? null,
    [slots, draft.slotId]
  );

  const step1Valid = !!draft.serviceId;
  const step2Valid = !!draft.slotId;
  const step3Valid =
    draft.clientName.trim().length >= 2 && draft.clientPhoneOrEmail.trim().length >= 5;

  function next() {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    if (step < 3) setStep((s) => ((s + 1) as Step));
  }

  function back() {
    if (step > 1) setStep((s) => ((s - 1) as Step));
  }

  async function submit() {
    setError(null);
    if (!step1Valid || !step2Valid || !step3Valid) return;

    setSubmitting(true);
    try {
      // Assumption: Firestore create booking doc happens here, validated by rules.
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      sessionStorage.removeItem(sessionKey);
    } catch (e: any) {
      setError(e?.message ?? "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!businessId) {
    return (
      <div className="min-h-screen bg-black text-neutral-200">
        <div className="max-w-[1600px] mx-auto px-12 py-12">
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-3xl tracking-tight font-extralight text-neutral-100">
              Invalid booking link
            </div>
            <p className="mt-4 text-[13px] font-light text-neutral-300/70">
              This booking link is missing a business identifier.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <div className="border-b border-neutral-800/40 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="py-8 flex items-start justify-between gap-8">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl tracking-tight font-extralight text-neutral-100">
                Book an appointment
              </h1>
              <p className="mt-3 text-sm md:text-base font-light text-neutral-300/80 max-w-[900px]">
                {businessName} • Secure booking • No account required
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm px-6 py-4 flex items-center gap-3">
              <Shield className="w-4 h-4 text-neutral-300" />
              <div className="text-[12px] font-light text-neutral-300/80">
                Session protected
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 py-12 space-y-12">
        <Stepper step={step} />

        {submitted ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-3xl tracking-tight font-extralight text-neutral-100">
              Request received
            </div>
            <p className="mt-4 text-[13px] font-light text-neutral-300/70 max-w-[860px]">
              Your booking request has been submitted. You’ll receive a confirmation message
              once it’s approved.
            </p>

            <div className="mt-10 rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
              <div className="text-[11px] font-light text-neutral-500/80">Summary</div>
              <div className="mt-3 text-[13px] font-light text-neutral-200">
                {selectedService?.name ?? "—"} • {selectedSlot?.label ?? "—"}
              </div>
            </div>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
                <div className="mb-10">
                  <div className="text-xl tracking-tight font-extralight text-neutral-100">
                    Choose a service
                  </div>
                  <div className="mt-3 text-[13px] font-light text-neutral-300/70">
                    Assumption: Services are loaded from the business catalog.
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {services.map((s) => (
                    <SelectCard
                      key={s.id}
                      active={draft.serviceId === s.id}
                      title={s.name}
                      subtitle={`${s.durationMin} min • ${s.price === 0 ? "Free" : `$${s.price}`}`}
                      right={
                        draft.serviceId === s.id ? (
                          <span className="text-[11px] font-light text-neutral-200">
                            Selected
                          </span>
                        ) : null
                      }
                      onClick={() => setDraft((d) => ({ ...d, serviceId: s.id }))}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
                <div className="mb-10">
                  <div className="text-xl tracking-tight font-extralight text-neutral-100">
                    Choose a time
                  </div>
                  <div className="mt-3 text-[13px] font-light text-neutral-300/70">
                    Assumption: Availability is derived from the business schedule + existing bookings.
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {slots.map((t) => (
                    <SelectCard
                      key={t.id}
                      active={draft.slotId === t.id}
                      title={t.label}
                      subtitle={selectedService ? `${selectedService.name} • ${selectedService.durationMin} min` : undefined}
                      right={<CalendarClock className="w-4 h-4 text-neutral-400" />}
                      onClick={() => setDraft((d) => ({ ...d, slotId: t.id }))}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
                <div className="mb-10">
                  <div className="text-xl tracking-tight font-extralight text-neutral-100">
                    Confirm details
                  </div>
                  <div className="mt-3 text-[13px] font-light text-neutral-300/70">
                    You’ll receive confirmation once the business approves the booking.
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Field label="Your name">
                        <Input
                          value={draft.clientName}
                          onChange={(v) => setDraft((d) => ({ ...d, clientName: v }))}
                          placeholder="Full name"
                        />
                      </Field>

                      <Field
                        label="Phone or email"
                        hint="Used for confirmation and reminders."
                      >
                        <Input
                          value={draft.clientPhoneOrEmail}
                          onChange={(v) => setDraft((d) => ({ ...d, clientPhoneOrEmail: v }))}
                          placeholder="Phone number or email"
                        />
                      </Field>
                    </div>

                    <Field label="Notes (optional)" hint="Anything the business should know?">
                      <TextArea
                        value={draft.notes}
                        onChange={(v) => setDraft((d) => ({ ...d, notes: v }))}
                        placeholder="Optional notes…"
                        rows={4}
                      />
                    </Field>

                    {error ? (
                      <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-6 text-[13px] font-light text-neutral-200">
                        {error}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-10">
                    <div className="text-[11px] font-light text-neutral-500/80">Summary</div>
                    <div className="mt-4 text-[15px] tracking-tight font-light text-neutral-100">
                      {selectedService?.name ?? "—"}
                    </div>
                    <div className="mt-2 text-[12px] font-light text-neutral-400/80">
                      {selectedService
                        ? `${selectedService.durationMin} min • ${
                            selectedService.price === 0 ? "Free" : `$${selectedService.price}`
                          }`
                        : "—"}
                    </div>

                    <div className="mt-6 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 p-6">
                      <div className="text-[11px] font-light text-neutral-500/80">Time</div>
                      <div className="mt-2 text-[13px] font-light text-neutral-200">
                        {selectedSlot?.label ?? "—"}
                      </div>
                    </div>

                    <div className="mt-8 text-[12px] font-light text-neutral-400/80">
                      By submitting, you agree to be contacted for confirmations and reminders.
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className="text-[12px] font-light text-neutral-500/80">
                    Business ID: <span className="text-neutral-300/80">{businessId}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {step < 3 ? (
                  <PrimaryCTA
                    disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
                    onClick={next}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </PrimaryCTA>
                ) : (
                  <PrimaryCTA disabled={submitting || !step3Valid} onClick={submit}>
                    {submitting ? "Submitting…" : "Submit booking request"}
                  </PrimaryCTA>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}