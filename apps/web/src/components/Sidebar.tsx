// apps/web/src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-8 pb-3 text-[11px] font-light tracking-[0.18em] text-neutral-500/80 uppercase">
      {children}
    </div>
  );
}

function NavItemLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        [
          "group w-full flex items-center gap-3 px-4 py-3 rounded-2xl",
          "border transition-all duration-[700ms]",
          "text-[13px] tracking-tight font-light",
          isActive
            ? "border-neutral-700/50 bg-neutral-950/40 text-neutral-100 shadow-[0_0_0_1px_rgba(229,231,235,0.10)]"
            : "border-transparent text-neutral-300/70 hover:text-neutral-100 hover:bg-neutral-950/30 hover:border-neutral-800/40 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]",
        ].join(" ")
      }
    >
      <item.icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-all duration-[700ms]" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  // ✅ FIX: alias logout → signOut
  const { logout: signOut, user } = useAuth();

  const operations: NavItem[] = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/clients", label: "Clients", icon: Users },
  ];

  const growth: NavItem[] = [
    { path: "/automations", label: "Automations", icon: Zap },
  ];

  const system: NavItem[] = [
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen bg-black border-r border-neutral-800/40">
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-neutral-800/40">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-neutral-700"
                />
                <path
                  d="M 28 52 Q 50 38 72 52 Q 50 66 28 52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-neutral-200"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="text-[14px] tracking-tight font-light text-neutral-100 truncate">
                Apex Booking
              </div>
              <div className="mt-1 text-[11px] font-light text-neutral-500/80 truncate">
                Revenue protection system
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 backdrop-blur-sm px-4 py-3">
            <div className="text-[11px] font-light text-neutral-500/80">Signed in</div>
            <div className="mt-1 text-[12px] font-light text-neutral-200 truncate">
              {user?.email ?? "—"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto px-4 pb-8">
          <SectionLabel>Operations</SectionLabel>
          <div className="space-y-2">
            {operations.map((item) => (
              <NavItemLink key={item.path} item={item} />
            ))}
          </div>

          <SectionLabel>Growth</SectionLabel>
          <div className="space-y-2">
            {growth.map((item) => (
              <NavItemLink key={item.path} item={item} />
            ))}
          </div>

          <SectionLabel>System</SectionLabel>
          <div className="space-y-2">
            {system.map((item) => (
              <NavItemLink key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-800/40">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-neutral-800/40 bg-neutral-950/20 text-[13px] font-light text-neutral-300/80 transition-all duration-[700ms] hover:scale-[1.02] hover:text-neutral-100 hover:bg-neutral-950/30 hover:shadow-[0_0_0_1px_rgba(229,231,235,0.08)]"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>

          <div className="mt-4 text-center text-[11px] font-light text-neutral-600/80">
            v0.1 • MVP
          </div>
        </div>
      </div>
    </aside>
  );
}