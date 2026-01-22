import TopBar from "../components/TopBar";
import { Users, Plus } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Clients" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-[20px] font-light mb-2">Client Management</h3>
              <p className="text-neutral-500 text-[14px] mb-6">
                Coming soon - Manage your clients and their booking history
              </p>
              <button className="inline-flex items-center gap-2 bg-gradient-to-b from-cyan-400 to-cyan-500 text-black px-6 py-3 rounded-lg text-[14px] font-semibold hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300">
                <Plus className="w-4 h-4" />
                Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}