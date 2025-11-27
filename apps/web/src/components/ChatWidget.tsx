import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#4F8BFF] shadow-lg shadow-blue-500/40 flex items-center justify-center text-white text-2xl"
        >
          💬
        </button>
      )}

      {/* Expanded Chat */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[450px] bg-[#0e141f] border border-white/10 rounded-xl shadow-xl shadow-blue-500/30 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-semibold">Apex AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto text-gray-300 text-sm">
            👋 Hi! I can help book appointments or answer questions.
          </div>

          <input
            type="text"
            placeholder="Type a message..."
            className="mt-3 bg-[#141b29] text-gray-200 px-3 py-2 rounded-lg outline-none border border-white/10"
          />
        </div>
      )}
    </>
  );
}