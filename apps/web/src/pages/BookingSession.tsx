// apps/web/src/pages/BookingSession.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * BOOKING SESSION (CLIENT-FACING)
 * Step 1:
 * - Create bookingSession
 * - Create appointment HOLD
 * - Prevent multiple active HOLDs
 * - Standards gate
 * - Countdown expiry
 */

type BookingSessionStatus = "ACTIVE" | "EXPIRED";
type AppointmentStatus = "HOLD" | "CONFIRMED" | "CANCELLED";
type DepositStatus = "REQUIRED" | "PAID" | "PENDING_MANUAL";

const HOLD_MINUTES = 10;

const SERVICES = [
  { name: "Signature Service", length: 60 },
  { name: "Express Service", length: 30 },
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export default function BookingSessionPage() {
  const [serviceName, setServiceName] = useState(SERVICES[0].name);
  const serviceLengthMin = useMemo(
    () => SERVICES.find((s) => s.name === serviceName)?.length ?? 60,
    [serviceName]
  );

  const defaultTimeISO = useMemo(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
    return d.toISOString().slice(0, 16);
  }, []);

  const [startTimeLocal, setStartTimeLocal] = useState(defaultTimeISO);
  const [acceptedStandards, setAcceptedStandards] = useState(false);

  const [creating, setCreating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const [holdExpiresAtMs, setHoldExpiresAtMs] = useState<number | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [expired, setExpired] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const standards = [
    "Deposit is required to secure your spot.",
    "Please arrive on time.",
    "Reschedules must be requested in advance.",
    "No-shows forfeit the deposit.",
  ];

  // Countdown
  useEffect(() => {
    if (!holdExpiresAtMs) return;

    const tick = () => {
      const left = holdExpiresAtMs - Date.now();
      setTimeLeftMs(left);
      if (left <= 0) setExpired(true);
    };

    tick();
    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [holdExpiresAtMs]);

  // Expire HOLD
  useEffect(() => {
    if (!expired || !sessionId) return;

    updateDoc(doc(db, "bookingSessions", sessionId), {
      status: "EXPIRED",
      expiredAt: serverTimestamp(),
    }).catch(() => {});

    if (appointmentId) {
      updateDoc(doc(db, "appointments", appointmentId), {
        status: "CANCELLED",
        cancelledReason: "HOLD_EXPIRED",
        cancelledAt: serverTimestamp(),
      }).catch(() => {});
    }
  }, [expired, sessionId, appointmentId]);

  const createHold = async () => {
    if (sessionId && !expired) return; // 🔒 block duplicate holds

    setCreating(true);
    setAcceptedStandards(false);
    setExpired(false);

    try {
      const startISO = new Date(startTimeLocal).toISOString();
      const holdExpires = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
      const holdTs = Timestamp.fromDate(holdExpires);

      const sessionRef = await addDoc(collection(db, "bookingSessions"), {
        createdAt: serverTimestamp(),
        status: "ACTIVE",
        holdExpiresAt: holdTs,
        serviceName,
        serviceLengthMin,
        startTimeISO: startISO,
      });

      const apptRef = await addDoc(collection(db, "appointments"), {
        createdAt: serverTimestamp(),
        status: "HOLD",
        holdExpiresAt: holdTs,
        bookingSessionId: sessionRef.id,
        serviceName,
        serviceLengthMin,
        startTimeISO: startISO,
        deposit: {
          required: true,
          status: "REQUIRED",
        },
      });

      setSessionId(sessionRef.id);
      setAppointmentId(apptRef.id);
      setHoldExpiresAtMs(holdExpires.getTime());
      setTimeLeftMs(holdExpires.getTime() - Date.now());
    } finally {
      setCreating(false);
    }
  };

  const startOver = async () => {
    if (sessionId) {
      await updateDoc(doc(db, "bookingSessions", sessionId), {
        status: "EXPIRED",
      }).catch(() => {});
    }
    if (appointmentId) {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "CANCELLED",
      }).catch(() => {});
    }

    setSessionId(null);
    setAppointmentId(null);
    setHoldExpiresAtMs(null);
    setAcceptedStandards(false);
    setExpired(false);
  };

  const canProceed = sessionId && acceptedStandards && !expired;

  const minutesLeft = Math.max(0, Math.floor(timeLeftMs / 60000));
  const secondsLeft = Math.max(0, Math.floor((timeLeftMs % 60000) / 1000));

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Step A */}
        <div className="bg-[#141b29] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-medium">Choose your service</h2>

          {SERVICES.map((s) => (
            <button
              key={s.name}
              onClick={() => setServiceName(s.name)}
              className={`block w-full text-left p-3 rounded-xl border ${
                s.name === serviceName
                  ? "border-[#4F8BFF]"
                  : "border-white/10"
              }`}
            >
              {s.name} · {s.length} min
            </button>
          ))}

          <input
            type="datetime-local"
            value={startTimeLocal}
            onChange={(e) => setStartTimeLocal(e.target.value)}
            className="w-full bg-[#0f1626] p-2 rounded-xl border border-white/10"
          />

          <div className="flex gap-3 items-center">
            <button
              onClick={createHold}
              disabled={creating || (sessionId && !expired)}
              className="px-5 py-3 bg-[#4F8BFF] rounded-xl"
            >
              {creating ? "Securing..." : "Secure My Spot"}
            </button>

            {sessionId && !expired && (
              <span className="text-sm">
                Expires in {pad2(minutesLeft)}:{pad2(secondsLeft)}
              </span>
            )}

            {sessionId && (
              <button
                onClick={startOver}
                className="text-sm text-gray-400 underline"
              >
                Start over
              </button>
            )}
          </div>
        </div>

        {/* Step B */}
        <div className={`bg-[#141b29] rounded-2xl p-6 ${!sessionId && "opacity-50"}`}>
          {standards.map((s) => (
            <div key={s} className="text-sm">{s}</div>
          ))}

          <label className="flex gap-2 mt-3 text-sm">
            <input
              type="checkbox"
              disabled={!sessionId}
              checked={acceptedStandards}
              onChange={(e) => setAcceptedStandards(e.target.checked)}
            />
            I understand and agree
          </label>
        </div>

        {/* Step C */}
        <div className="bg-[#141b29] rounded-2xl p-6">
          <button
            disabled={!canProceed}
            onClick={() => alert("Payment step next")}
            className={`px-5 py-3 rounded-xl ${
              canProceed ? "bg-[#4F8BFF]" : "bg-white/10"
            }`}
          >
            Pay deposit to confirm
          </button>
        </div>
      </div>
    </div>
  );
}