import TopBar from "../components/TopBar";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Calendar" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[24px] font-light">{monthName}</h2>
              <div className="flex gap-2">
                <button className="p-2 text-neutral-400 hover:text-white transition-colors duration-300">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors duration-300">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-[20px] font-light mb-2">Calendar View</h3>
              <p className="text-neutral-500 text-[14px]">
                Coming soon - Full calendar with booking management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}