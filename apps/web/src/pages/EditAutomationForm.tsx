import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { X, Save, Trash2 } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  type?: string;
  serviceLength: number;
  requiresDeposit: boolean;
}

export default function EditAutomationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [serviceLength, setServiceLength] = useState("60");
  const [requiresDeposit, setRequiresDeposit] = useState(false);

  useEffect(() => {
    const loadAutomation = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "automations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Automation;
          setName(data.name ?? "");
          setServiceLength(data.serviceLength.toString());
          setRequiresDeposit(!!data.requiresDeposit);
        }
      } catch (error) {
        console.error("Error loading automation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAutomation();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "automations", id), {
        name,
        serviceLength: Number(serviceLength),
        requiresDeposit,
      });
      navigate(`/automations/${id}`);
    } catch (error) {
      console.error("Error updating automation:", error);
      alert("Failed to update automation");
    } finally {
      setSaving(false);
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
      <div className="flex flex-col h-screen bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-neutral-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="h-16 bg-neutral-950/50 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-8">
        <h1 className="text-[20px] font-light tracking-tight">Edit Automation</h1>
        <button
          onClick={() => navigate(`/automations/${id}`)}
          className="text-neutral-400 hover:text-white transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-neutral-800/50 rounded-2xl max-w-2xl w-full">
          <div className="p-6 border-b border-neutral-800/50">
            <h3 className="text-[24px] font-light mb-1">Edit Automation</h3>
            <p className="text-[13px] text-neutral-500">
              Update the details for this automation
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[13px] text-neutral-400 mb-2 font-medium">
                Automation Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[13px] text-neutral-400 mb-2 font-medium">
                Service Duration (minutes)
              </label>
              <input
                type="number"
                value={serviceLength}
                onChange={(e) => setServiceLength(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="deposit"
                type="checkbox"
                checked={requiresDeposit}
                onChange={(e) => setRequiresDeposit(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-cyan-400 focus:ring-cyan-400"
              />
              <label htmlFor="deposit" className="text-[14px] text-neutral-300">
                Require deposit payment
              </label>
            </div>

            <div className="flex gap-3 pt-6 border-t border-neutral-800/50">
              <button
                onClick={handleSave}
                disabled={saving || !name || !serviceLength}
                className="flex items-center gap-2 flex-1 bg-gradient-to-b from-cyan-400 to-cyan-500 text-black py-3 rounded-lg font-semibold hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}