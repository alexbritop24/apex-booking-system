import { useState } from "react";
import SlidePanel from "../components/SlidePanel";
import NewAutomationForm from "../components/NewAutomationForm";

export default function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main content */}
      <div className="p-8 text-white space-y-6 overflow-y-auto h-full">
        <div className="text-3xl font-bold">
          Welcome to Apex Booking System
        </div>

        <div className="bg-[#0f1623] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">
            Automate your bookings with AI
          </h2>
          <p className="text-gray-400 mb-4">
            Let Apex handle scheduling, deposits, reminders, and upsells.
          </p>

          <button
            onClick={() => setIsPanelOpen(true)}
            className="px-4 py-2 bg-[#4F8BFF] hover:bg-[#3a71d6] text-white rounded-lg font-medium transition"
          >
            Create Automation
          </button>
        </div>
      </div>

      {/* Slide-in panel */}
      <SlidePanel
        isOpen={isPanelOpen}
        title="Create new automation"
        onClose={() => setIsPanelOpen(false)}
      >
        <NewAutomationForm />
      </SlidePanel>
    </div>
  );
}