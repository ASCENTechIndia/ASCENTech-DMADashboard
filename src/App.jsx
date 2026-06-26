import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import "./styles/dashboard.css";
import RTSDashboard_NEW from "./pages/RTSDashboared_NEW";
import DMADashboard from "./pages/DMADashboard";
import Home_NEW from "./pages/Home_NEW";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/propertydashboard" element={<DMADashboard />} />

        {/* Existing Home page */}
        <Route path="/" element={<Home_NEW />} />

        {/* <Route path="/rtsdashboard" element={<RTSDashboard />} /> */}

        {/* NEW RTS Dashboard */}
        <Route path="/rtsdashboard" element={<RTSDashboard_NEW />} />

        {/* NEW Home Dashboard */}
        {/* <Route path="/home-new" element={<Home_NEW />} /> */}
      </Routes>
    </Router>
  );
}

export default App;