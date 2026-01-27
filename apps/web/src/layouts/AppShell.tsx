// apps/web/src/layouts/AppShell.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <div className="flex">
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-w-0">
          {/* Pages will render their own GlassTopBar and container */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}