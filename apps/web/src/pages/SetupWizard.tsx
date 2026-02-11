// apps/web/src/pages/SetupWizard.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Check, ChevronLeft, ChevronRight, Shield, Zap } from "lucide-react";

type Step = 1 | 2 | 3;

type Industry = "Barber" | "Salon" | "Med Spa" | "Clinic" | "Other";

type SetupDraft = {
  businessName: string;
  industry: Industry;
  timezone: string;
  businessPhone: string;
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
        "text-neutral-950 text-[14px] tracking-tight font-medium",
        "transition-all duration-[700ms]",
        "bg-gradient-to-b from-neutral-100 to-neutral-300",
        "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.20)]",
        "disabled:opacity-100",
        "disabled:cursor-not-allowed",
        "disabled:brightness-95",
        "disabled:text-neutral-800",
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

function SelectCard({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle?: string;
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
      <div className="text-[15px] tracking-tight font-light text-neutral-100">{title}</div>
      {subtitle ? (
        <div className="mt-2 text-[12px] font-light text-neutral-400/80">{subtitle}</div>
      ) : null}
    </button>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Business" },
    { n: 2, label: "Defaults" },
    { n: 3, label: "Finish" },
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

export default function SetupWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<SetupDraft>({
    businessName: "",
    industry: "Salon",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Denver",
    businessPhone: "",
  });

  const canStep1 = draft.businessName.trim().length >= 2 && !!draft.industry;
  const canStep2 = true; // defaults step is informational; we keep it frictionless
  const canFinish = canStep1;

  const industryOptions: Array<{ v: Industry; label: string; sub: string }> = useMemo(
    () => [
      { v: "Barber", label: "Barber", sub: "High-frequency bookings, quick reminders." },
      { v: "Salon", label: "Salon", sub: "Service bundles, repeat clients, rebooking." },
      { v: "Med Spa", label: "Med Spa", sub: "Higher ticket, deposits, follow-ups." },
      { v: "Clinic", label: "Clinic", sub: "Structured schedule, confirmations, compliance." },
      { v: "Other", label: "Other", sub: "Use the same automation baseline." },
    ],
    []
  );

  function next() {
    if (step === 1 && !canStep1) return;
    if (step === 2 && !canStep2) return;
    if (step < 3) setStep((s) => ((s + 1) as Step));
  }

  function back() {
    if (step > 1) setStep((s) => ((s - 1) as Step));
  }

  async function finish() {
    setError(null);
    if (!user?.uid) {
      setError("You must be signed in to complete setup.");
      return;
    }
    if (!canFinish) return;

    setBusy(true);
    try {
      // BusinessId strategy (MVP): use uid as businessId to keep multi-tenant simple.
      // If you want multiple businesses per owner later, we’ll switch to generated IDs.
      const businessId = user.uid;

      await setDoc(
        doc(db, "businesses", businessId),
        {
          ownerUid: user.uid,
          name: draft.businessName.trim(),
          industry: draft.industry,
          timezone: draft.timezone,
          phone: draft.businessPhone.trim(),
          onboardingCompleted: true,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Store active business for app queries.
      localStorage.setItem("apex_activeBusinessId", businessId);

      navigate("/", { replace: true });
    } catch (e: any) {
      setError(e?.message ?? "Setup failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <div className="border-b border-neutral-800/40 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="py-10 flex items-start justify-between gap-8">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl tracking-tight font-extralight text-neutral-100">
                Business setup
              </h1>
              <p className="mt-3 text-sm md:text-base font-light text-neutral-300/80 max-w-[900px]">
                You’re minutes away from taking bookings and automating follow-ups.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm px-6 py-4 flex items-center gap-3">
              <Shield className="w-4 h-4 text-neutral-300" />
              <div className="text-[12px] font-light text-neutral-300/80">Owner setup</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 py-12 space-y-12">
        <Stepper step={step} />

        {step === 1 ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="mb-10">
              <div className="text-xl tracking-tight font-extralight text-neutral-100">
                Step 1 — Business details
              </div>
              <div className="mt-3 text-[13px] font-light text-neutral-300/70 max-w-[920px]">
                Keep it simple. You can refine settings later.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Field label="Business name" hint="This appears on booking confirmations.">
                <Input
                  value={draft.businessName}
                  onChange={(v) => setDraft((d) => ({ ...d, businessName: v }))}
                  placeholder="e.g. Apex Med Spa"
                />
              </Field>

              <Field label="Business phone (optional)" hint="Used for contact links and reminders (later).">
                <Input
                  value={draft.businessPhone}
                  onChange={(v) => setDraft((d) => ({ ...d, businessPhone: v }))}
                  placeholder="e.g. (801) 555-0199"
                />
              </Field>
            </div>

            <div className="mt-10">
              <div className="text-[12px] font-light text-neutral-400/90">Industry</div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industryOptions.map((opt) => (
                  <SelectCard
                    key={opt.v}
                    active={draft.industry === opt.v}
                    title={opt.label}
                    subtitle={opt.sub}
                    onClick={() => setDraft((d) => ({ ...d, industry: opt.v }))}
                  />
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Field label="Timezone" hint="Used for availability, reminders, and reporting.">
                <Input
                  value={draft.timezone}
                  onChange={(v) => setDraft((d) => ({ ...d, timezone: v }))}
                  placeholder="America/Denver"
                />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="text-[12px] font-light text-neutral-400/90">Step 2 — Defaults</div>
              <div className="mt-4 text-3xl tracking-tight font-extralight text-neutral-100">
                We start with revenue protection
              </div>
              <p className="mt-6 text-[13px] font-light text-neutral-300/70 max-w-[920px]">
                Assumption: The fastest win is reducing no-shows and improving rebooking.
                We’ll preconfigure a calm baseline you can edit later.
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                  <div className="text-[13px] font-light text-neutral-100">Default automations</div>
                  <ul className="mt-4 space-y-3 text-[13px] font-light text-neutral-300/80">
                    <li>• 24h reminder (SMS)</li>
                    <li>• 2h reminder (SMS)</li>
                    <li>• Post-visit follow-up (Email)</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                  <div className="text-[13px] font-light text-neutral-100">Default KPIs</div>
                  <ul className="mt-4 space-y-3 text-[13px] font-light text-neutral-300/80">
                    <li>• Bookings this week</li>
                    <li>• Monthly revenue (protected)</li>
                    <li>• Active clients (90 days)</li>
                    <li>• Automations running</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neutral-200" />
                </div>
                <div>
                  <div className="text-[13px] font-light text-neutral-100">Proof modules</div>
                  <div className="mt-1 text-[12px] font-light text-neutral-400/80">
                    Feature → result framing
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-[13px] font-light text-neutral-300/80">
                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-6">
                  <div className="text-[12px] text-neutral-500/80">Assumption</div>
                  <div className="mt-2">Automated reminders → −38% no-shows</div>
                </div>
                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-6">
                  <div className="text-[12px] text-neutral-500/80">Assumption</div>
                  <div className="mt-2">Deposit enforcement → +$1.2k/mo protected</div>
                </div>
                <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-6">
                  <div className="text-[12px] text-neutral-500/80">Assumption</div>
                  <div className="mt-2">Follow-ups → +21% rebooks</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
            <div className="text-[12px] font-light text-neutral-400/90">Step 3 — Finish</div>
            <div className="mt-4 text-3xl tracking-tight font-extralight text-neutral-100">
              You’re ready to take bookings
            </div>
            <p className="mt-6 text-[13px] font-light text-neutral-300/70 max-w-[920px]">
              We’ll create your business workspace and send you to the dashboard.
            </p>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                <div className="text-[12px] font-light text-neutral-500/80">Business</div>
                <div className="mt-2 text-[15px] tracking-tight font-light text-neutral-100">
                  {draft.businessName || "—"}
                </div>
                <div className="mt-2 text-[12px] font-light text-neutral-400/80">
                  {draft.industry} • {draft.timezone}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800/40 bg-black/20 p-8">
                <div className="text-[12px] font-light text-neutral-500/80">Next recommended action</div>
                <div className="mt-2 text-[15px] tracking-tight font-light text-neutral-100">
                  Create your first automation
                </div>
                <div className="mt-2 text-[12px] font-light text-neutral-400/80">
                  Start with 24h + 2h reminders. Then add follow-ups.
                </div>
              </div>
            </div>

            {error ? (
              <div className="mt-10 rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-6 text-[13px] font-light text-neutral-200">
                {error}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-6">
          <div>
            {step > 1 ? (
              <GhostButton onClick={back}>
                <ChevronLeft className="w-4 h-4" />
                Back
              </GhostButton>
            ) : (
              <div className="text-[12px] font-light text-neutral-500/80">
                Signed in as{" "}
                <span className="text-neutral-300/80">{user?.email ?? "unknown"}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {step < 3 ? (
              <PrimaryCTA
                disabled={(step === 1 && !canStep1) || (step === 2 && !canStep2)}
                onClick={next}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </PrimaryCTA>
            ) : (
              <PrimaryCTA disabled={busy || !canFinish} onClick={finish}>
                {busy ? "Finalizing…" : "Finish setup"}
              </PrimaryCTA>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}