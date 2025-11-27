import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="flex bg-[#0b0f19] min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <TopBar />
        <Dashboard />
      </div>

      <ChatWidget />
    </div>
  );
}


