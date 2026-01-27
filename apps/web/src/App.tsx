// apps/web/src/App.tsx
import React, { useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AppShell from "./layouts/AppShell";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Existing pages
import Dashboard from "./pages/Dashboard";
import AutomationsPage from "./pages/Automations";
import CalendarPage from "./pages/Calendar";
import ClientsPage from "./pages/Clients";
import SettingsPage from "./pages/Settings";
import SetupWizard from "./pages/SetupWizard";

import NewAutomationForm from "./components/NewAutomationForm";
import AutomationDetails from "./pages/AutomationDetails";
import EditAutomationForm from "./pages/EditAutomationForm";

// Public booking
import PublicBooking from "./pages/PublicBooking";

function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <div className="max-w-[1600px] mx-auto px-12 py-12">
        <div className="grid place-items-center min-h-[calc(100vh-96px)]">
          <div className="w-full max-w-[520px] rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10 space-y-8">
            <div>
              <div className="text-3xl tracking-tight font-extralight text-neutral-100">
                {title}
              </div>
              {subtitle ? (
                <div className="mt-3 text-[13px] font-light text-neutral-300/70">
                  {subtitle}
                </div>
              ) : null}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-2">
      <div className="text-[12px] font-light text-neutral-400/90">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          "w-full rounded-2xl px-5 py-4",
          "bg-black/30 border border-neutral-800/40",
          "text-neutral-100 placeholder:text-neutral-600/80",
          "outline-none",
          "transition-all duration-[700ms]",
          "focus:border-neutral-700/60 focus:shadow-[0_0_0_1px_rgba(229,231,235,0.10)]",
        ].join(" ")}
      />
    </label>
  );
}

function PrimaryButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={[
        "w-full rounded-2xl px-6 py-4",
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

function LoginInline() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: string } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectTo = useMemo(() => location?.state?.from ?? "/", [location]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn({ email, password, remember });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame
      title="Sign in"
      subtitle="Access your dashboard, automations, and booking controls."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@business.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-6">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-neutral-200"
            />
            <span className="text-[13px] font-light text-neutral-300/80">
              Remember me
            </span>
          </label>

          <a
            href="/auth/reset"
            className="text-[13px] font-light text-neutral-300/80 hover:text-neutral-200 transition-all duration-[700ms]"
          >
            Forgot password
          </a>
        </div>

        {error ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-5 text-[13px] font-light text-neutral-200">
            {error}
          </div>
        ) : null}

        <PrimaryButton disabled={busy || !email || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </PrimaryButton>

        <div className="pt-2 text-center">
          <a
            href="/auth/signup"
            className="text-[13px] font-light text-neutral-300/80 hover:text-neutral-200 transition-all duration-[700ms]"
          >
            Create an account
          </a>
        </div>
      </form>
    </AuthFrame>
  );
}

function SignupInline() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signUp({ email, password, remember });
      navigate("/setup", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Signup failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame
      title="Create account"
      subtitle="Get set up in minutes. You can start taking bookings today."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@business.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
        />

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-neutral-200"
          />
          <span className="text-[13px] font-light text-neutral-300/80">
            Remember me
          </span>
        </label>

        {error ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-5 text-[13px] font-light text-neutral-200">
            {error}
          </div>
        ) : null}

        <PrimaryButton disabled={busy || !email || password.length < 6}>
          {busy ? "Creating…" : "Create account"}
        </PrimaryButton>

        <div className="pt-2 text-center">
          <a
            href="/auth/login"
            className="text-[13px] font-light text-neutral-300/80 hover:text-neutral-200 transition-all duration-[700ms]"
          >
            Back to sign in
          </a>
        </div>
      </form>
    </AuthFrame>
  );
}

function ResetPasswordInline() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await resetPassword(email);
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? "Reset failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame
      title="Reset password"
      subtitle="We’ll email you a secure link to reset your password."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@business.com"
          autoComplete="email"
        />

        {done ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-6 text-[13px] font-light text-neutral-200">
            If an account exists for{" "}
            <span className="text-neutral-100">{email}</span>, you’ll receive a
            reset email shortly.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 p-5 text-[13px] font-light text-neutral-200">
            {error}
          </div>
        ) : null}

        <PrimaryButton disabled={busy || !email}>
          {busy ? "Sending…" : "Send reset link"}
        </PrimaryButton>

        <div className="pt-2 text-center">
          <a
            href="/auth/login"
            className="text-[13px] font-light text-neutral-300/80 hover:text-neutral-200 transition-all duration-[700ms]"
          >
            Back to sign in
          </a>
        </div>
      </form>
    </AuthFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public auth */}
          <Route path="/auth/login" element={<LoginInline />} />
          <Route path="/auth/signup" element={<SignupInline />} />
          <Route path="/auth/reset" element={<ResetPasswordInline />} />

          {/* Public booking */}
          <Route path="/book/:businessId" element={<PublicBooking />} />

          {/* Protected: main app shell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="automations" element={<AutomationsPage />} />
              <Route path="automations/new" element={<NewAutomationForm />} />
              <Route path="automations/:id" element={<AutomationDetails />} />
              <Route path="automations/:id/edit" element={<EditAutomationForm />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Protected: setup wizard (Outlet pattern, no children prop) */}
            <Route path="/setup" element={<SetupWizard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}