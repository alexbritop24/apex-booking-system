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
    <div className="px-4 pt-7 pb-2 text-[10px] font-medium tracking-[0.22em] text-neutral-500/70 uppercase">
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
          "group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl",
          "transition-all duration-200 select-none",
          "text-[13px] leading-none",
          // base
          "text-neutral-300/75 hover:text-neutral-100",
          "hover:bg-white/[0.04]",
          // active
          isActive ? "bg-white/[0.06] text-neutral-100" : "",
        ].join(" ")
      }
    >
      {/* active indicator */}
      <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-cyan-300/70 opacity-0 group-[.active]:opacity-100" />

      <item.icon className="w-[16px] h-[16px] text-neutral-400 group-hover:text-neutral-200 transition-colors duration-200" />

      <span className="truncate">{item.label}</span>

      {/* subtle hover/active border */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-white/[0.06] group-[.active]:ring-cyan-300/15" />
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout: signOut, user } = useAuth();

  const operations: NavItem[] = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/clients", label: "Clients", icon: Users },
  ];

  const growth: NavItem[] = [{ path: "/automations", label: "Automations", icon: Zap }];

  const system: NavItem[] = [{ path: "/settings", label: "Settings", icon: Settings }];

  return (
    <aside className="w-72 h-screen shrink-0">
      {/* Layered sidebar surface */}
      <div className="relative h-full border-r border-neutral-800/60 bg-neutral-950">
        {/* subtle inner glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(56,189,248,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]" />

        <div className="relative h-full flex flex-col">
          {/* Brand */}
          <div className="px-5 py-6 border-b border-neutral-800/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06] flex items-center justify-center">
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
                <div className="text-[14px] font-semibold tracking-[-0.02em] text-neutral-100 truncate">
                  Apex Booking
                </div>
                <div className="mt-1 text-[11px] text-neutral-500/80 truncate">
                  Revenue protection system
                </div>
              </div>
            </div>

            {/* Account chip */}
            <div className="mt-5 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] px-4 py-3">
              <div className="text-[10px] font-medium tracking-[0.18em] text-neutral-500/70 uppercase">
                Signed in
              </div>
              <div className="mt-1 text-[12px] text-neutral-200 truncate">
                {user?.email ?? "—"}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-auto px-3 pb-6">
            <SectionLabel>Operations</SectionLabel>
            <div className="space-y-1">
              {operations.map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
            </div>

            <SectionLabel>Growth</SectionLabel>
            <div className="space-y-1">
              {growth.map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
            </div>

            <SectionLabel>System</SectionLabel>
            <div className="space-y-1">
              {system.map((item) => (
                <NavItemLink key={item.path} item={item} />
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-800/60">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-[13px] text-neutral-300/80 transition-all duration-200 hover:bg-white/[0.05] hover:text-neutral-100"
            >
              <LogOut className="w-[16px] h-[16px]" />
              Log out
            </button>

            <div className="mt-4 text-center text-[11px] text-neutral-600/80">
              v0.1 • MVP
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}