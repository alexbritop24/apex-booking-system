export default function TopBar() {
  return (
    <div className="w-full h-16 bg-[#0e141f] border-b border-white/10 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#141b29] text-gray-300 px-3 py-2 rounded-lg outline-none border border-white/10 text-sm"
        />

        <div className="w-9 h-9 rounded-full bg-gray-600"></div>
      </div>
    </div>
  );
}