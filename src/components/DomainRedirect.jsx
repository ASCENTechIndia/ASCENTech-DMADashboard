// DomainRedirect.jsx
// Watches the current hostname and redirects to /dhuledashboard
// when the user visits from dashboard.dhulecorporation.in

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DHULE_DOMAIN = import.meta.env.VITE_DHULE_DOMAIN || "dashboard.dhulecorporation.in";

function DomainRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    // If the user is on the Dhule domain and at root "/", redirect to /dhuledashboard
    if (hostname === DHULE_DOMAIN && location.pathname === "/") {
      navigate("/dhuledashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}

export default DomainRedirect;
