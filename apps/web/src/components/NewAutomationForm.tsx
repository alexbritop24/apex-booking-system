import { useState } from "react";
import { saveAutomation } from "../services/saveAutomation";

const automationTypes = [
  {
    id: "booking",
    label: "AI Booking Flow",
    description: "Let clients book appointments 24/7 through your AI assistant.",
  },
  {
    id: "deposit",
    label: "Deposit & No-Show Protection",
    description: "Collect deposits automatically and reduce ghosting.",
  },
  {
    id: "upsell",
    label: "Upsell Add-ons",
    description: "Offer add-ons like brow tint, beard trim, or nail art.",
  },
  {
    id: "reviews",
    label: "Review Requests",
    description: "Automatically ask happy clients to leave Google reviews.",
  },
];

const steps = ["Automation type", "Details", "Review & Save"];

export default function NewAutomationForm() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string>("booking");
  const [name, setName] = useState("New Booking Flow");
  const [serviceLength, setServiceLength] = useState("60");
  const [requiresDeposit, setRequiresDeposit] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentType = automationTypes.find((t) => t.id === selectedType);

  const canGoNext = step === 0 ? !!selectedType : true;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    const payload = {
      type: selectedType,
      name,
      serviceLength: Number(serviceLength),
      requiresDeposit,
      createdAt: new Date().toISOString(),
    };

    const result = await saveAutomation(payload);

    setIsSaving(false);

    if (result.success) {
      alert("Automation saved successfully!");
      // OPTIONAL: Close panel or reset form later
    } else {
      alert("Error saving automation. Check console.");
    }
  };

  return (
    <div className="text-white space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                index === step
                  ? "bg-[#4F8BFF] border-[#4F8BFF] text-white"
                  : index < step
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-500 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={
                index === step ? "text-white font-medium" : "text-gray-400"
              }
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className="w-6 h-px bg-gray-600 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What do you want to automate?</h3>
          <p className="text-gray-400 text-sm">
            Choose the type of automation. You can create multiple later.
          </p>

          <div className="space-y-3 mt-2">
            {automationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  selectedType === type.id
                    ? "border-[#4F8BFF] bg-[#141b2a]"
                    : "border-white/10 bg-[#0f1623] hover:bg-[#141b2a]"
                }`}
              >
                <div className="font-semibold">{type.label}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic details</h3>
          <p className="text-gray-400 text-sm">
            Name your automation and add the key details for the AI.
          </p>

          <div className="space-y-3 mt-2 text-sm">
            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-1">Automation name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141b29] border border-white/10 rounded-lg px-3 py-2 text-gray-100 outline-none"
              />
            </div>

            {/* Service length */}
            <div>
              <label className="block text-gray-300 mb-1">
                Default service length (minutes)
              </label>
              <input
                type="number"
                value={serviceLength}
                onChange={(e) => setServiceLength(e.target.value)}
                className="w-full bg-[#141b29] border border-white/10 rounded-lg px-3 py-2 text-gray-100 outline-none"
              />
            </div>

            {/* Deposit toggle */}
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
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-sm">
          <h3 className="text-lg font-semibold">Review & save</h3>
          <p className="text-gray-400">
            Here’s how this automation will behave. The AI engine will use this
            as the base configuration.
          </p>

          <div className="bg-[#141b29] border border-white/10 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-gray-400">Type: </span>
              <span className="text-white font-medium">
                {currentType?.label}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Name: </span>
              <span className="text-white font-medium">{name}</span>
            </div>
            <div>
              <span className="text-gray-400">Service length: </span>
              <span className="text-white font-medium">
                {serviceLength} minutes
              </span>
            </div>
            <div>
              <span className="text-gray-400">Deposit required: </span>
              <span className="text-white font-medium">
                {requiresDeposit ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div className="bg-[#0f1623] border border-dashed border-[#4F8BFF]/60 rounded-lg p-4 mt-3">
            <div className="text-xs text-gray-300 mb-2">Example AI message:</div>
            <div className="text-xs text-gray-200 italic">
              “Great! I can book that for you. Our {name.toLowerCase()} is{" "}
              {serviceLength} minutes. To secure your spot, a{" "}
              {requiresDeposit ? "small deposit" : "no deposit"} is required.
              Which day works best for you?”
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex justify-between pt-2 border-t border-white/10 mt-4">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className={`text-sm px-3 py-2 rounded-lg border ${
            step === 0
              ? "border-transparent text-gray-500 cursor-default"
              : "border-white/20 text-gray-200 hover:bg-white/5"
          }`}
        >
          Back
        </button>

        {/* Next / Save */}
        <div className="flex gap-2">
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className={`text-sm px-4 py-2 rounded-lg bg-[#4F8BFF] text-white font-medium ${
                !canGoNext ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          )}

          {step === steps.length - 1 && (
            <button
              type="button"
              onClick={handleSave}
              className="text-sm px-4 py-2 rounded-lg bg-green-500 text-white font-medium"
            >
              {isSaving ? "Saving..." : "Save Automation (MVP)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}