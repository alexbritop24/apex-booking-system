// apps/web/src/pages/AutomationDetails.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

interface Automation {
  id: string;
  type: string;
  name: string;
  serviceLength: number;
  requiresDeposit: boolean;
  createdAt?: any;
}

export default function AutomationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [automation, setAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const ref = doc(db, "automations", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAutomation({ id: snap.id, ...snap.data() } as Automation);
      } else {
        setAutomation(null);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!automation) {
    return (
      <div className="text-gray-400">
        Automation not found.
        <button
          onClick={() => navigate("/automations")}
          className="ml-2 text-blue-400 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const formatDate = () => {
    if (!automation.createdAt?.toDate) return "";
    return automation.createdAt.toDate().toLocaleString();
  };

  return (
    <div className="text-white space-y-6">
      <button
        onClick={() => navigate("/automations")}
        className="text-sm text-gray-400 underline hover:text-gray-200"
      >
        ← Back to Automations
      </button>

      <h1 className="text-2xl font-semibold">{automation.name}</h1>

      <div className="space-y-2 bg-[#141b29] p-4 rounded-lg border border-white/10">
        <div>
          <span className="text-gray-400">Type: </span>
          <span className="text-white">{automation.type}</span>
        </div>

        <div>
          <span className="text-gray-400">Service length: </span>
          <span className="text-white">{automation.serviceLength} minutes</span>
        </div>

        <div>
          <span className="text-gray-400">Deposit required: </span>
          <span className="text-white">
            {automation.requiresDeposit ? "Yes" : "No"}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Created: </span>
          <span className="text-white">{formatDate()}</span>
        </div>
      </div>

      {/* Edit */}
      <button
        onClick={() => navigate(`/automations/${automation.id}/edit`)}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium"
      >
        Edit Automation
      </button>

      {/* Delete (activated in Step 3) */}
      <button
        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium ml-3"
        onClick={() => alert("Delete function coming in Step 3")}
      >
        Delete Automation
      </button>
    </div>
  );
}