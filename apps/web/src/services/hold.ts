// apps/web/src/services/holds.ts
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Step 1 hardening:
 * - Create bookingSession with serverTimestamp()
 * - Read it back to get server-resolved createdAt
 * - Compute holdExpiresAt from server time (createdAt) + holdMinutes
 * - Update bookingSession.holdExpiresAt
 * - Create appointment with status HOLD + same holdExpiresAt
 *
 * This avoids relying on the client clock for hold expiry.
 */

export type BookingSessionStatus = "ACTIVE" | "EXPIRED";
export type AppointmentStatus = "HOLD" | "CONFIRMED" | "CANCELLED";
export type DepositStatus = "REQUIRED" | "PAID" | "PENDING_MANUAL";

export type BookingSessionDoc = {
  createdAt: any;
  status: BookingSessionStatus;
  holdMinutes: number;
  holdExpiresAt?: any;

  // Minimal booking info (extend later)
  serviceName: string;
  serviceLengthMin: number;
  startTimeISO: string;
};

export type AppointmentDoc = {
  createdAt: any;
  status: AppointmentStatus;
  holdExpiresAt: any;

  bookingSessionId: string;

  serviceName: string;
  serviceLengthMin: number;
  startTimeISO: string;

  deposit: {
    required: boolean;
    status: DepositStatus;
    method?: "STRIPE" | "VENMO" | "ZELLE" | "MANUAL";
  };
};

export type CreateHoldInput = {
  serviceName: string;
  serviceLengthMin: number;
  startTimeISO: string;
  holdMinutes: number;

  // Locked rule: always true
  depositRequired?: boolean;
};

export type CreateHoldResult = {
  bookingSessionId: string;
  appointmentId: string;
  holdExpiresAtMs: number;
};

/**
 * Creates a server-time-based HOLD.
 */
export async function createBookingHold(input: CreateHoldInput): Promise<CreateHoldResult> {
  const {
    serviceName,
    serviceLengthMin,
    startTimeISO,
    holdMinutes,
    depositRequired = true,
  } = input;

  // 1) Create booking session (serverTimestamp)
  const sessionPayload: BookingSessionDoc = {
    createdAt: serverTimestamp(),
    status: "ACTIVE",
    holdMinutes,
    serviceName,
    serviceLengthMin,
    startTimeISO,
  };

  const sessionRef = await addDoc(collection(db, "bookingSessions"), sessionPayload);

  // 2) Read back to get server-resolved createdAt
  const sessionSnap = await getDoc(doc(db, "bookingSessions", sessionRef.id));
  if (!sessionSnap.exists()) {
    throw new Error("bookingSession read-back failed");
  }

  const createdAt = sessionSnap.data().createdAt as Timestamp | undefined;
  if (!createdAt || typeof createdAt.toMillis !== "function") {
    // If this happens, it usually means Firestore hasn’t resolved serverTimestamp yet.
    // A retry would be acceptable, but we’ll keep it strict so bugs surface early.
    throw new Error("bookingSession.createdAt not resolved (serverTimestamp)");
  }

  // 3) Compute holdExpiresAt from SERVER time
  const holdExpiresAtMs = createdAt.toMillis() + holdMinutes * 60 * 1000;
  const holdExpiresAtTs = Timestamp.fromMillis(holdExpiresAtMs);

  // 4) Update bookingSession with holdExpiresAt
  await updateDoc(doc(db, "bookingSessions", sessionRef.id), {
    holdExpiresAt: holdExpiresAtTs,
  });

  // 5) Create appointment in HOLD state
  const appointmentPayload: AppointmentDoc = {
    createdAt: serverTimestamp(),
    status: "HOLD",
    holdExpiresAt: holdExpiresAtTs,
    bookingSessionId: sessionRef.id,

    serviceName,
    serviceLengthMin,
    startTimeISO,

    deposit: {
      required: depositRequired, // locked rule = true
      status: "REQUIRED",
    },
  };

  const apptRef = await addDoc(collection(db, "appointments"), appointmentPayload);

  return {
    bookingSessionId: sessionRef.id,
    appointmentId: apptRef.id,
    holdExpiresAtMs,
  };
}

/**
 * Best-effort expire/cancel when hold time runs out.
 * (We’ll later enforce expiry server-side with a scheduled job / function.)
 */
export async function expireHold(params: {
  bookingSessionId: string;
  appointmentId?: string | null;
}) {
  const { bookingSessionId, appointmentId } = params;

  try {
    await updateDoc(doc(db, "bookingSessions", bookingSessionId), {
      status: "EXPIRED",
      expiredAt: serverTimestamp(),
    });
  } catch {
    // best effort
  }

  if (appointmentId) {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "CANCELLED",
        cancelledReason: "HOLD_EXPIRED",
        cancelledAt: serverTimestamp(),
      });
    } catch {
      // best effort
    }
  }
}