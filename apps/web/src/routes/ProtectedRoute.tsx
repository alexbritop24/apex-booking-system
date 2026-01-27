// apps/web/src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function FullscreenLoader() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <div className="max-w-[1600px] mx-auto px-12 py-12">
        <div className="space-y-12">
          <div className="rounded-2xl border border-neutral-800/40 bg-neutral-950/40 backdrop-blur-sm p-10">
            <div className="space-y-6">
              <div className="h-8 w-56 rounded-xl bg-neutral-900/60 animate-pulse" />
              <div className="h-4 w-[420px] rounded-lg bg-neutral-900/60 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="h-28 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm animate-pulse" />
                <div className="h-28 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm animate-pulse" />
                <div className="h-28 rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/app" element={<AppShell />}>
 *     ...
 *   </Route>
 * </Route>
 */
export default function ProtectedRoute() {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") return <FullscreenLoader />;

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}