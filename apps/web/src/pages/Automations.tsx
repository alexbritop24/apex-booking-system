import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { Calendar, DollarSign, Clock, Star, ArrowRight } from "lucide-react";

interface Automation {
  id: string;
  type: string;
  name: string;
  serviceLength: number;
  requiresDeposit: boolean;
  active?: boolean;
  triggers?: number;
  createdAt?: any;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "automations"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const list: Automation[] = [];

      snapshot.forEach((doc: any) => {
        list.push({
          id: doc.id,
          active: true, // Default to active
          triggers: 0, // Default triggers
          ...doc.data(),
        } as Automation);
      });

      setAutomations(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getAutomationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-6 h-6 text-cyan-400" />;
      case "deposit":
        return <DollarSign className="w-6 h-6 text-cyan-400" />;
      case "reminder":
        return <Clock className="w-6 h-6 text-cyan-400" />;
      case "review":
      case "reviews":
        return <Star className="w-6 h-6 text-cyan-400" />;
      case "upsell":
        return <Star className="w-6 h-6 text-cyan-400" />;
      default:
        return <Calendar className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Automations"
        showNewButton={true}
        onNewClick={() => navigate("/automations/new")}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl space-y-6">
          <div>
            <h2 className="text-[24px] font-light mb-2">Your Automations</h2>
            <p className="text-[14px] text-neutral-500">
              AI-powered workflows that run automatically
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-neutral-900/50 rounded-xl h-24"
                />
              ))}
            </div>
          ) : automations.length === 0 ? (
            <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-[18px] font-light mb-2">No automations yet</h3>
              <p className="text-[14px] text-neutral-500 mb-6">
                Create your first automation to start saving time
              </p>
              <button
                onClick={() => navigate("/automations/new")}
                className="bg-gradient-to-b from-cyan-400 to-cyan-500 text-black px-6 py-3 rounded-lg text-[14px] font-semibold"
              >
                Create Automation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  onClick={() => navigate(`/automations/${automation.id}`)}
                  className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                        {getAutomationIcon(automation.type)}
                      </div>
                      <div>
                        <div className="text-[16px] font-medium text-white mb-1">
                          {automation.name}
                        </div>
                        <div className="text-[12px] text-neutral-500">
                          {automation.triggers || 0} triggers this week
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                          automation.active !== false
                            ? "bg-green-400/10 text-green-400"
                            : "bg-neutral-700/50 text-neutral-500"
                        }`}
                      >
                        {automation.active !== false ? "Active" : "Paused"}
                      </div>
                      <button className="text-neutral-400 hover:text-cyan-400 transition-colors duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}