// apps/web/src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AutomationsPage from "./pages/Automations";
import NewAutomationForm from "./components/NewAutomationForm";
import AutomationDetails from "./pages/AutomationDetails";
import EditAutomationForm from "./pages/EditAutomationForm";

export default function App() {
  return (
    <Router>
      <div className="flex w-full min-h-screen bg-[#0b1120] text-white">

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-8">
          <Routes>

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Automations list */}
            <Route path="/automations" element={<AutomationsPage />} />

            {/* Create new automation */}
            <Route path="/automations/new" element={<NewAutomationForm />} />

            {/* Automation details */}
            <Route path="/automations/:id" element={<AutomationDetails />} />

            {/* 🔥 Edit automation */}
            <Route path="/automations/:id/edit" element={<EditAutomationForm />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}
