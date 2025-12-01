// apps/web/src/pages/Automations.tsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

interface Automation {
  id: string;
  type: string;
  name: string;
  serviceLength: number;
  requiresDeposit: boolean;
  createdAt?: any;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const typeIcon: Record<string, string> = {
    booking: "📅",
    deposit: "💵",
    upsell: "✨",
    reviews: "⭐",
  };

  useEffect(() => {
    const q = query(
      collection(db, "automations"),
      orderBy("createdAt", "desc")
    );

    // TS fix: snapshot/doc typed as any so TS7006 goes away
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const list: Automation[] = [];

      snapshot.forEach((doc: any) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        } as Automation);
      });

      setAutomations(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="text-white space-y-6">
      <h1 className="text-2xl font-semibold">Your Automations</h1>
      <p className="text-gray-400 text-sm">
        These are the AI automations you’ve created.
      </p>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[#1a2333] rounded-lg h-16 w-full"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && automations.length === 0 && (
        <div className="text-gray-400 text-sm">
          You haven’t created any automations yet.
        </div>
      )}

      {/* Automations List */}
      {!loading && automations.length > 0 && (
        <div className="space-y-3">
          {automations.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/automations/${a.id}`)}
              className="cursor-pointer bg-[#141b29] border border-white/10 rounded-lg p-4
              hover:bg-[#182030] transition duration-150"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium flex items-center gap-1">
                    <span>{typeIcon[a.type] || "⚙️"}</span>
                    {a.name}
                  </div>

                  <div className="text-gray-400 text-xs mt-1">
                    {a.type} • {a.serviceLength} min •{" "}
                    {a.requiresDeposit ? "Deposit required" : "No deposit"}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  {a.createdAt?.toDate
                    ? a.createdAt.toDate().toLocaleDateString()
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}