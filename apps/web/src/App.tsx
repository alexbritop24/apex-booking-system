import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AutomationsPage from "./pages/Automations";
import CalendarPage from "./pages/Calendar";
import ClientsPage from "./pages/Clients";
import SettingsPage from "./pages/Settings";
import NewAutomationForm from "./components/NewAutomationForm";
import AutomationDetails from "./pages/AutomationDetails";
import EditAutomationForm from "./pages/EditAutomationForm";

export default function App() {
  return (
    <Router>
      <div className="flex w-full min-h-screen bg-black text-white">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/automations" element={<AutomationsPage />} />
            <Route path="/automations/new" element={<NewAutomationForm />} />
            <Route path="/automations/:id" element={<AutomationDetails />} />
            <Route path="/automations/:id/edit" element={<EditAutomationForm />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}