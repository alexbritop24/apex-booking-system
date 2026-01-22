import TopBar from "../components/TopBar";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Settings" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-[20px] font-light mb-2">Settings</h3>
              <p className="text-neutral-500 text-[14px]">
                Coming soon - Configure your business settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}