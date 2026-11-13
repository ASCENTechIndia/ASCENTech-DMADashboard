import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./styles/dashboard.css";
import RTSDashboard_NEW from "./pages/RTSDashboared_NEW";
import DMADashboard from "./pages/DMADashboard";
import Home_NEW from "./pages/Home_NEW";
import CardDetailPage from "./pages/CardDetailPage";
import DomainRedirect from "./components/DomainRedirect";
import RTSServicesPendancy from "./pages/RTSServicesPendancy";
import Configuration from "./pages/Configuration";

function App() {
  return (
    <Router>
      <DomainRedirect />

      <Routes>
        <Route path="/propertydashboard" element={<DMADashboard />} />

        {/* Main Dashboard page (handles All Corporations + Dhule + Latur directly on their domains at /) */}
        <Route path="/" element={<Home_NEW />} />
        <Route path="/dhuledashboard" element={<Navigate to="/" replace />} />
        <Route path="/laturdashboard" element={<Navigate to="/" replace />} />
        <Route path="/mbmcdashboard" element={<Navigate to="/" replace />} />

        {/* NEW RTS Dashboard */}
        <Route path="/rtsdashboard" element={<RTSDashboard_NEW />} />

        {/* Card Detail Page */}
        <Route path="/dhuledashboard/detail/:cardKey" element={<CardDetailPage />} />
        <Route path="/home/detail/:cardKey" element={<CardDetailPage />} />

        {/* RTS Services Wise Pendancy */}
        <Route path="/dhuledashboard/rts-services" element={<RTSServicesPendancy />} />
        <Route path="/rts-services" element={<RTSServicesPendancy />} />

        <Route path="/configuration" element={<Configuration />} />
        {/* Fallback route to prevent blank page on unrecognized paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
} 

export default App;