import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Zap, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/clients", label: "Clients", icon: Users },
    { path: "/automations", label: "Automations", icon: Zap },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-neutral-950 border-r border-neutral-800/50 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800/50">
        <div className="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 100 100" className="w-8 h-8">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-neutral-800"
            />
            <circle cx="50" cy="30" r="8" fill="currentColor" className="text-neutral-100" />
            <circle cx="50" cy="70" r="8" fill="currentColor" className="text-neutral-100" />
            <path
              d="M 30 50 Q 50 42 70 50 Q 50 58 30 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-cyan-400"
            />
          </svg>
          <div>
            <div className="font-semibold text-[15px] tracking-tight">Apex Booking</div>
            <div className="text-[11px] text-neutral-500">System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-300 ${
                isActive
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800/50">
        <div className="text-[11px] text-neutral-600">v0.1.0 • MVP Build</div>
      </div>
    </div>
  );
}