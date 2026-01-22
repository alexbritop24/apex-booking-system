import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import TopBar from "../components/TopBar";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

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

export default function AutomationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutomation = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "automations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAutomation({ id: docSnap.id, ...docSnap.data() } as Automation);
        } else {
          navigate("/automations");
        }
      } catch (error) {
        console.error("Error fetching automation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomation();
  }, [id, navigate]);

  const handleToggleActive = async () => {
    if (!id || !automation) return;

    try {
      const newActiveState = automation.active !== false ? false : true;
      await updateDoc(doc(db, "automations", id), {
        active: newActiveState,
      });
      setAutomation({ ...automation, active: newActiveState });
    } catch (error) {
      console.error("Error updating automation:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this automation?")) return;

    try {
      await deleteDoc(doc(db, "automations", id));
      navigate("/automations");
    } catch (error) {
      console.error("Error deleting automation:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <TopBar title="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-neutral-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!automation) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar title={automation.name} />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => navigate("/automations")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 text-[14px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Automations
          </button>

          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[24px] font-light">{automation.name}</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/automations/${id}/edit`)}
                  className="p-2 text-neutral-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-neutral-400 hover:text-red-400 transition-colors duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-500">Type</span>
                <span className="text-white capitalize">{automation.type}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-500">Duration</span>
                <span className="text-white">{automation.serviceLength} minutes</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-500">Deposit</span>
                <span className="text-white">
                  {automation.requiresDeposit ? "Required" : "Not required"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-500">Triggers This Week</span>
                <span className="text-white">{automation.triggers || 0}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-neutral-500">Status</span>
                <button
                  onClick={handleToggleActive}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-300 ${
                    automation.active !== false
                      ? "bg-green-400/10 text-green-400 hover:bg-green-400/20"
                      : "bg-neutral-700/50 text-neutral-500 hover:bg-neutral-700"
                  }`}
                >
                  {automation.active !== false ? "Active" : "Paused"}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800/50">
              <h3 className="text-[16px] font-medium mb-4">Automation Logs</h3>
              <p className="text-neutral-500 text-[14px]">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}