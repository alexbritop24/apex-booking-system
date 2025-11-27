export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0b0f19] border-r border-white/10 flex flex-col p-6">
      <div className="text-2xl font-bold text-white tracking-tight mb-10">
        Apex<span className="text-[#4F8BFF] ml-1">Booking</span>
      </div>

      <nav className="text-gray-300 space-y-4">
        {[
          "Dashboard",
          "Automations",
          "Calendar",
          "Clients",
          "Settings",
        ].map((item) => (
          <div
            key={item}
            className={`cursor-pointer px-3 py-2 rounded-lg transition ${
              item === "Dashboard"
                ? "bg-[#1a2333] text-white"
                : "hover:bg-[#1a2333]"
            }`}
          >
            {item}
          </div>
        ))}
      </nav>
    </div>
  );
}