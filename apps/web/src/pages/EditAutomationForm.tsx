// apps/web/src/pages/EditAutomationForm.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAutomationById,
  updateAutomation,
  deleteAutomation,
} from "../services/automationService";

// This describes what a single automation looks like in Firestore
interface AutomationRecord {
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

  // LOAD THE AUTOMATION DATA
  useEffect(() => {
    const loadAutomation = async () => {
      if (!id) return;

      const data = (await getAutomationById(id)) as AutomationRecord | null;

      if (!data) {
        setLoading(false);
        return;
      }

      setName(data.name ?? "");
      setServiceLength(data.serviceLength.toString());
      setRequiresDeposit(!!data.requiresDeposit);

      setLoading(false);
    };

    loadAutomation();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);

    await updateAutomation(id, {
      name,
      serviceLength: Number(serviceLength),
      requiresDeposit,
    });

    setSaving(false);
    navigate("/automations");
  };

  const handleDelete = async () => {
    if (!id) return;

    await deleteAutomation(id);
    navigate("/automations");
  };

  if (loading) {
    return <div className="text-gray-300 text-sm">Loading...</div>;
  }

  return (
    <div className="text-white space-y-6">
      <h1 className="text-2xl font-semibold">Edit Automation</h1>
      <p className="text-gray-400 text-sm">
        Update the details for this automation. Changes will be used by the AI
        assistant right away.
      </p>

      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-gray-300 mb-1">Automation name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#141b29] border border-white/10 rounded-lg px-3 py-2 text-gray-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">
            Service length (minutes)
          </label>
          <input
            type="number"
            value={serviceLength}
            onChange={(e) => setServiceLength(e.target.value)}
            className="w-full bg-[#141b29] border border-white/10 rounded-lg px-3 py-2 text-gray-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            id="deposit"
            type="checkbox"
            checked={requiresDeposit}
            onChange={(e) => setRequiresDeposit(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="deposit" className="text-gray-300 text-sm">
            Require deposit to confirm booking
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`text-sm px-4 py-2 rounded-lg bg-[#4F8BFF] text-white font-medium ${
            saving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="text-sm px-4 py-2 rounded-lg border border-red-500/70 text-red-400 hover:bg-red-500/10"
        >
          Delete Automation
        </button>

        <button
          type="button"
          onClick={() => navigate("/automations")}
          className="text-sm px-3 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/5 ml-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}