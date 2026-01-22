// apps/web/src/pages/Book.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  acceptBookingStandards,
  createBookingSessionWithHold,
  expireHoldIfNeeded,
  getAppointmentById,
  getBookingSessionById,
} from "../services/bookingService";

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getLocalTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Denver";
  } catch {
    return "America/Denver";
  }
}

/**
 * Single page handles:
 * - /book          -> create HOLD
 * - /book/:sessionId -> standards gate + hold timer
 */
export default function BookPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // ------- STEP A: pick a slot + create HOLD -------
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const tz = useMemo(() => getLocalTimezone(), []);

  // Minimal slot options (MVP). Replace later with real availability.
  const slotOptions = useMemo(() => {
    const now = new Date();

    const makeSlot = (daysFromNow: number, hour: number, minutes: number, lengthMin: number) => {
      const start = new Date(now);
      start.setDate(start.getDate() + daysFromNow);
      start.setHours(hour, minutes, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + lengthMin);

      return { start, end, label: `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` };
    };

    return [
      makeSlot(1, 10, 0, 60),
      makeSlot(1, 13, 0, 60),
      makeSlot(2, 11, 0, 60),
    ];
  }, []);

  async function handleCreateHold(startAt: Date, endAt: Date) {
    setCreating(true);
    setCreateError(null);

    try {
      // MVP placeholders — later these come from business onboarding / service catalog
      const businessId = "demo-business-001";

      const result = await createBookingSessionWithHold({
        businessId,
        serviceId: "default-service",
        timezone: tz,
        startAt,
        endAt,
        holdMinutes: 15,
        depositAmountCents: 2000, // $20 MVP default
        customer: {}, // will be captured via chat/AI later
      });

      navigate(`/book/${result.sessionId}`);
    } catch (e: any) {
      setCreateError(e?.message ?? "Something went wrong. Try again.");
    } finally {
      setCreating(false);
    }
  }

  // ------- STEP B: load session + standards gate -------
  const [loadingSession, setLoadingSession] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [appointment, setAppointment] = useState<any>(null);

  const [holdExpired, setHoldExpired] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);

  const [standardsChecked, setStandardsChecked] = useState(false);
  const [accepting, setAccepting] = useState(false);

  // Load session only when sessionId exists
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!sessionId) return;

      setLoadingSession(true);
      setHoldExpired(false);

      const s = await getBookingSessionById(sessionId);
      if (!mounted) return;

      setSession(s);

      if (s?.appointmentId) {
        const appt = await getAppointmentById(s.appointmentId);
        if (!mounted) return;
        setAppointment(appt);

        // MVP safety: expire if needed
        const result = await expireHoldIfNeeded(s.appointmentId);
        if (!mounted) return;

        if (result === "EXPIRED") {
          setHoldExpired(true);
        }
      }

      setLoadingSession(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  // Timer tick
  useEffect(() => {
    if (!appointment?.holdExpiresAt?.toDate) return;

    const tick = () => {
      const expires = appointment.holdExpiresAt.toDate().getTime();
      const now = Date.now();
      const diff = expires - now;
      setTimeLeftMs(diff);
      if (diff <= 0) setHoldExpired(true);
    };

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [appointment?.holdExpiresAt]);

  const canShowStandardsGate = !!sessionId;

  const depositReady =
    standardsChecked &&
    !accepting &&
    !holdExpired &&
    appointment?.status === "HOLD";

  async function handleAcceptStandards() {
    if (!sessionId) return;
    setAccepting(true);

    try {
      await acceptBookingStandards(sessionId);
      // Keep UX simple: just allow next step on this screen.
    } finally {
      setAccepting(false);
    }
  }

  // ------- RENDER -------
  // /book (start)
  if (!canShowStandardsGate) {
    return (
      <div className="text-white max-w-3xl">
        <h1 className="text-3xl font-semibold">Book your spot</h1>
        <p className="text-gray-300 mt-2">
          Pick a time. Your spot will be held for a short time while you confirm.
        </p>

        <div className="mt-8 space-y-3">
          {slotOptions.map((slot) => (
            <button
              key={slot.label}
              onClick={() => handleCreateHold(slot.start, slot.end)}
              disabled={creating}
              className={`w-full text-left bg-[#141b29] border border-white/10 rounded-xl p-4 hover:bg-[#182030] transition ${
                creating ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <div className="text-lg font-medium">{slot.label}</div>
              <div className="text-xs text-gray-400 mt-1">Secure your spot with a deposit</div>
            </button>
          ))}
        </div>

        {createError && (
          <div className="mt-4 text-sm text-red-300 border border-red-500/30 bg-red-500/10 rounded-lg p-3">
            {createError}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400">
          You won’t be charged until you confirm.
        </div>
      </div>
    );
  }

  // /book/:sessionId (standards gate + timer)
  if (loadingSession) {
    return <div className="text-gray-300 text-sm">Loading…</div>;
  }

  if (!session) {
    return (
      <div className="text-white">
        <div className="text-gray-300">Booking not found.</div>
        <button
          onClick={() => navigate("/book")}
          className="mt-4 text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5"
        >
          Start again
        </button>
      </div>
    );
  }

  const showExpired = holdExpired || appointment?.status === "EXPIRED";

  return (
    <div className="text-white max-w-3xl space-y-6">
      <button
        onClick={() => navigate("/book")}
        className="text-gray-300 text-sm hover:text-white"
      >
        ← Pick a different time
      </button>

      <div className="bg-[#141b29] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your spot is on hold</h1>
            <p className="text-gray-300 text-sm mt-2">
              Confirm your booking before the timer runs out.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Time left</div>
            <div className={`text-xl font-semibold ${showExpired ? "text-red-300" : ""}`}>
              {showExpired ? "Expired" : formatTimeLeft(timeLeftMs)}
            </div>
          </div>
        </div>

        {showExpired && (
          <div className="mt-4 text-sm text-red-300 border border-red-500/30 bg-red-500/10 rounded-lg p-3">
            This hold expired. Please pick a new time.
          </div>
        )}

        {/* Standards gate */}
        <div className="mt-6 border-t border-white/10 pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Before you confirm</h2>

          <div className="text-sm text-gray-200 bg-[#0f1626] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="font-medium text-white">Appointment standards</div>
            <ul className="list-disc pl-5 space-y-1 text-gray-200">
              <li>Please arrive on time. Late arrivals may shorten the service.</li>
              <li>Your deposit secures your spot and locks the appointment.</li>
              <li>Reschedules must be requested ahead of time.</li>
              <li>No-shows waste time inventory and block other clients.</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-200">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4"
              checked={standardsChecked}
              onChange={(e) => setStandardsChecked(e.target.checked)}
              disabled={showExpired}
            />
            <span>I understand and accept these standards</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleAcceptStandards}
              disabled={!standardsChecked || accepting || showExpired}
              className={`px-4 py-2 rounded-lg bg-[#4F8BFF] text-white font-medium ${
                !standardsChecked || accepting || showExpired
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:opacity-95"
              }`}
            >
              {accepting ? "Saving…" : "Continue"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/book")}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 text-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Deposit button placeholder (Step 2) */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="text-sm text-gray-300">
            Next: pay the deposit to lock your appointment.
          </div>

          <button
            type="button"
            disabled={!depositReady}
            className={`mt-3 px-5 py-3 rounded-xl font-semibold ${
              depositReady
                ? "bg-[#22c55e] text-white hover:opacity-95"
                : "bg-white/10 text-gray-300 cursor-not-allowed"
            }`}
            onClick={() => {
              // Step 2 will route to payment method selection (Stripe / Venmo / Zelle)
              // For now keep it inert to avoid half-built flows.
              alert("Step 2: Deposit methods (Stripe / Venmo / Zelle) is next.");
            }}
          >
            Pay deposit
          </button>
        </div>
      </div>
    </div>
  );
}