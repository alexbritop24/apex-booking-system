// apps/web/src/services/bookingService.ts
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
 * Core booking rule (LOCKED):
 * - Every booking requires a deposit.
 * - We always create a HOLD first with a timer.
 * - Booking becomes CONFIRMED only after deposit is paid/verified (Step 2).
 */

export type BookingStage =
  | "INTAKE"
  | "HOLD_CREATED"
  | "STANDARDS_SHOWN"
  | "READY_TO_PAY"
  | "CONFIRMED"
  | "EXPIRED";

export type AppointmentStatus = "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export type CustomerInfo = {
  name?: string;
  phone?: string;
  email?: string;
};

export type CreateHoldInput = {
  businessId: string;
  serviceId?: string | null;

  customer?: CustomerInfo;

  // Required for MVP: you choose the slot in UI (or AI proposes it later)
  startAt: Date;
  endAt: Date;

  // Timezone is stored for later calendar integration
  timezone?: string;

  // HOLD timer (minutes). Default 15.
  holdMinutes?: number;

  // Deposit amount for MVP. Later: derived from business/service pricing.
  depositAmountCents?: number;
};

export type BookingSessionRecord = {
  businessId: string;
  serviceId: string | null;
  customer: CustomerInfo;

  requestedStart: Timestamp | null;
  requestedEnd: Timestamp | null;
  timezone: string;

  stage: BookingStage;
  standardsAcceptedAt: Timestamp | null;

  appointmentId: string | null;
  holdExpiresAt: Timestamp | null;

  createdAt: any;
  updatedAt: any;
};

export type AppointmentRecord = {
  businessId: string;
  serviceId: string | null;

  customer: CustomerInfo;

  startAt: Timestamp;
  endAt: Timestamp;

  status: AppointmentStatus;

  depositRequired: true;
  depositAmountCents: number;

  holdExpiresAt: Timestamp;

  bookingSessionId: string;

  createdAt: any;
  updatedAt: any;
};

export type CreateHoldResult = {
  sessionId: string;
  appointmentId: string;
  holdExpiresAt: Date;
};

/**
 * Create bookingSession + HOLD appointment (inventory lock).
 * This is the single "Step 1" backend action.
 */
export async function createBookingSessionWithHold(
  input: CreateHoldInput
): Promise<CreateHoldResult> {
  const holdMinutes = input.holdMinutes ?? 15;
  const depositAmountCents = input.depositAmountCents ?? 2000; // MVP default = $20

  const timezone = input.timezone ?? "America/Denver";

  const now = new Date();
  const holdExpiresAtDate = new Date(now.getTime() + holdMinutes * 60_000);

  const startAtTs = Timestamp.fromDate(input.startAt);
  const endAtTs = Timestamp.fromDate(input.endAt);
  const holdExpiresAtTs = Timestamp.fromDate(holdExpiresAtDate);

  // 1) Create booking session
  const sessionRef = await addDoc(collection(db, "bookingSessions"), {
    businessId: input.businessId,
    serviceId: input.serviceId ?? null,
    customer: input.customer ?? {},

    requestedStart: startAtTs,
    requestedEnd: endAtTs,
    timezone,

    stage: "INTAKE" as BookingStage,
    standardsAcceptedAt: null,

    appointmentId: null,
    holdExpiresAt: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies BookingSessionRecord);

  // 2) Create HOLD appointment (time = inventory)
  const apptRef = await addDoc(collection(db, "appointments"), {
    businessId: input.businessId,
    serviceId: input.serviceId ?? null,

    customer: input.customer ?? {},

    startAt: startAtTs,
    endAt: endAtTs,

    status: "HOLD" as AppointmentStatus,

    depositRequired: true,
    depositAmountCents,

    holdExpiresAt: holdExpiresAtTs,

    bookingSessionId: sessionRef.id,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies AppointmentRecord);

  // 3) Back-link appointment into the session
  await updateDoc(doc(db, "bookingSessions", sessionRef.id), {
    appointmentId: apptRef.id,
    holdExpiresAt: holdExpiresAtTs,
    stage: "HOLD_CREATED",
    updatedAt: serverTimestamp(),
  });

  return {
    sessionId: sessionRef.id,
    appointmentId: apptRef.id,
    holdExpiresAt: holdExpiresAtDate,
  };
}

/**
 * Standards gate acceptance.
 * This is the only "permission" needed before showing Pay Deposit (Step 2).
 */
export async function acceptBookingStandards(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "bookingSessions", sessionId), {
    standardsAcceptedAt: serverTimestamp(),
    stage: "READY_TO_PAY",
    updatedAt: serverTimestamp(),
  });
}

/**
 * MVP-safe HOLD expiry check.
 * Use this when loading a HOLD appointment to ensure stale holds don't linger.
 * (For production, we'll replace/augment with a scheduled Cloud Function.)
 */
export async function expireHoldIfNeeded(
  appointmentId: string
): Promise<"EXPIRED" | "ACTIVE" | "NOT_FOUND"> {
  const ref = doc(db, "appointments", appointmentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return "NOT_FOUND";

  const data = snap.data() as Partial<AppointmentRecord>;
  if (data.status !== "HOLD") return "ACTIVE";

  const holdExpiresAt = data.holdExpiresAt as Timestamp | undefined;
  if (!holdExpiresAt) return "ACTIVE";

  const now = Date.now();
  const expires = holdExpiresAt.toDate().getTime();

  if (now <= expires) return "ACTIVE";

  await updateDoc(ref, {
    status: "EXPIRED",
    updatedAt: serverTimestamp(),
  });

  return "EXPIRED";
}

/**
 * Convenience fetchers (helps UI tomorrow).
 */
export async function getBookingSessionById(sessionId: string) {
  const ref = doc(db, "bookingSessions", sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as any;
}

export async function getAppointmentById(appointmentId: string) {
  const ref = doc(db, "appointments", appointmentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as any;
}