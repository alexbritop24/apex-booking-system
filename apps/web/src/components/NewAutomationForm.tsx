import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { X, Calendar, DollarSign, Clock, Star, Check } from "lucide-react";

export default function NewAutomationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    serviceLength: "",
    requiresDeposit: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const automationTypes = [
    {
      type: "booking",
      label: "Booking Flow",
      desc: "Automated booking responses",
      icon: Calendar,
    },
    {
      type: "deposit",
      label: "Deposit Collection",
      desc: "Request deposits automatically",
      icon: DollarSign,
    },
    {
      type: "reminder",
      label: "Reminders",
      desc: "Send appointment reminders",
      icon: Clock,
    },
    {
      type: "review",
      label: "Review Requests",
      desc: "Request reviews after service",
      icon: Star,
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "automations"), {
        ...formData,
        serviceLength: parseInt(formData.serviceLength),
        active: true,
        triggers: 0,
        createdAt: serverTimestamp(),
      });
      navigate("/automations");
    } catch (error) {
      console.error("Error creating automation:", error);
      alert("Failed to create automation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="h-16 bg-neutral-950/50 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-8">
        <h1 className="text-[20px] font-light tracking-tight">Create Automation</h1>
        <button
          onClick={() => navigate("/automations")}
          className="text-neutral-400 hover:text-white transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-neutral-800/50 rounded-2xl max-w-2xl w-full">
          <div className="p-6 border-b border-neutral-800/50">
            <h3 className="text-[24px] font-light mb-1">Create Automation</h3>
            <p className="text-[13px] text-neutral-500">Step {step} of 3</p>
          </div>

          <div className="p-8">
            {/* Step 1: Select Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] text-neutral-400 mb-3 font-medium">
                    Select Automation Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {automationTypes.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.type}
                          onClick={() => {
                            setFormData({ ...formData, type: option.type });
                            setStep(2);
                          }}
                          className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-5 text-left hover:border-cyan-400/50 hover:bg-neutral-800/70 transition-all duration-300 group"
                        >
                          <Icon className="w-6 h-6 text-cyan-400 mb-3" />
                          <div className="text-[15px] font-medium text-white mb-1">
                            {option.label}
                          </div>
                          <div className="text-[12px] text-neutral-500">{option.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] text-neutral-400 mb-2 font-medium">
                    Automation Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New Client Booking Flow"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[13px] text-neutral-400 mb-2 font-medium">
                    Service Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.serviceLength}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceLength: e.target.value })
                    }
                    placeholder="60"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="deposit"
                    checked={formData.requiresDeposit}
                    onChange={(e) =>
                      setFormData({ ...formData, requiresDeposit: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-cyan-400 focus:ring-cyan-400"
                  />
                  <label htmlFor="deposit" className="text-[14px] text-neutral-300">
                    Require deposit payment
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-neutral-800 text-white py-3 rounded-lg font-medium hover:bg-neutral-700 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.name || !formData.serviceLength}
                    className="flex-1 bg-gradient-to-b from-cyan-400 to-cyan-500 text-black py-3 rounded-lg font-semibold hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[16px] font-medium">Automation Ready</div>
                      <div className="text-[12px] text-neutral-500">Review and activate</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Type:</span>
                      <span className="text-white capitalize">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Name:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Duration:</span>
                      <span className="text-white">{formData.serviceLength} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Deposit:</span>
                      <span className="text-white">
                        {formData.requiresDeposit ? "Required" : "Not required"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 bg-neutral-800 text-white py-3 rounded-lg font-medium hover:bg-neutral-700 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-b from-cyan-400 to-cyan-500 text-black py-3 rounded-lg font-semibold hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Activate Automation"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}