import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
  showNewButton?: boolean;
  onNewClick?: () => void;
}

export default function TopBar({ title, showNewButton = false, onNewClick }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-neutral-950/50 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-8">
      <div>
        <h1 className="text-[20px] font-light tracking-tight">{title}</h1>
        <p className="text-[12px] text-neutral-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {showNewButton && (
        <button
          onClick={onNewClick || (() => navigate("/automations/new"))}
          className="flex items-center gap-2 bg-gradient-to-b from-cyan-400 to-cyan-500 text-black px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Automation
        </button>
      )}
    </div>
  );
}