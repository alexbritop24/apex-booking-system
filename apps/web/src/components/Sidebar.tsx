// apps/web/src/components/Sidebar.tsx

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-60 bg-[#0d1424] h-screen border-r border-white/10 p-5 flex flex-col">
      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-white mb-8">
        Apex Booking System
      </h1>

      {/* Navigation */}
      <nav className="space-y-1">

        {/* Dashboard */}
        <Link
          to="/"
          className={`block px-3 py-2 rounded-lg text-sm transition ${
            isActive("/")
              ? "bg-[#141b2a] text-white"
              : "text-gray-400 hover:bg-[#141b2a]"
          }`}
        >
          Dashboard
        </Link>

        {/* Automations Section */}
        <div>
          <div
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              location.pathname.startsWith("/automations")
                ? "text-white"
                : "text-gray-400"
            }`}
          >
            Automations
          </div>

          <div className="ml-4 mt-1 space-y-1">

            {/* Automations List */}
            <Link
              to="/automations"
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                isActive("/automations")
                  ? "bg-[#141b2a] text-white"
                  : "text-gray-400 hover:bg-[#141b2a]"
              }`}
            >
              View Automations
            </Link>

            {/* Create New Automation */}
            <Link
              to="/automations/new"
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                isActive("/automations/new")
                  ? "bg-[#141b2a] text-white"
                  : "text-gray-400 hover:bg-[#141b2a]"
              }`}
            >
              + New Automation
            </Link>
          </div>
        </div>

      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-500">
        v0.1.0 • MVP Build
      </div>
    </div>
  );
}