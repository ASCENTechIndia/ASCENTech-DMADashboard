import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/dashboard.css";
import RTSDashboard_NEW from "./pages/RTSDashboared_NEW";
import DMADashboard from "./pages/DMADashboard";
import Home_NEW from "./pages/Home_NEW";
import Dhule_Dashboard from "./pages/Dhule_Dashboard";
import CardDetailPage from "./pages/CardDetailPage";
import DomainRedirect from "./components/DomainRedirect";
import DhuleDashboard_Preprod from "./pages/dhuledashboard-preprod";

function App() {
  return (
    <Router>
      {/* Redirects dashboard.dhulecorporation.in → /dhuledashboard */}
      <DomainRedirect />

      <Routes>
        <Route path="/propertydashboard" element={<DMADashboard />} />

        {/* Main Home page */}
        <Route path="/" element={<Home_NEW />} />

        {/* {<Route path="/rtsdashboard" element={<RTSDashboard />} />} */}

        {/* NEW RTS Dashboard */}
        <Route path="/rtsdashboard" element={<RTSDashboard_NEW />} />

        {/* DMC Dashboard – Dhule */}
        <Route path="/dhuledashboard" element={<Dhule_Dashboard />} />

        {/* Card Detail Page – opened when a Dhule dashboard card is clicked */}
        <Route path="/dhuledashboard/detail/:cardKey" element={<CardDetailPage />} />

        {/* Dhule Dashboard – Pre-Production */}
        <Route path="/dhuledashboard-preprod" element={<DhuleDashboard_Preprod />} />

        {/* NEW Home Dashboard */}
        {/* <Route path="/home-new" element={<Home_NEW />} /> */}
      </Routes>
    </Router>
  );
} 

export default App;
