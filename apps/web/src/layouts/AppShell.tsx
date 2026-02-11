// apps/web/src/layouts/AppShell.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppShell() {
  return (
    <div className="h-screen text-neutral-200 bg-neutral-950">
      {/* Subtle background depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(99,102,241,0.10),transparent_55%)]" />

      <div className="relative flex h-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto border-l border-neutral-800/60">
          {/* Global page gutter + max width */}
          <div className="px-6 py-8 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}