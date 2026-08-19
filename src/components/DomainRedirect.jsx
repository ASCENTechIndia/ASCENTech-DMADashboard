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

  // Update document title and favicon according to domain or pathname
  useEffect(() => {
    const hostname = window.location.hostname;
    const path = location.pathname;

    let title = "dma-dashboard";
    let faviconHref = "/favicon.svg";

    if (
      hostname.includes("dhulecorporation.in") ||
      hostname === DHULE_DOMAIN ||
      path.startsWith("/dhuledashboard")
    ) {
      title = "Dhule-dashboard";
      faviconHref = "/DMC_logo.jpg";
    } else {
      title = "dma-dashboard";
      faviconHref = "/favicon.svg";
    }

    // Set document title
    document.title = title;

    // Set favicon href dynamically
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    
    link.href = faviconHref;

    // Correct MIME type for standard and image icons
    if (faviconHref.endsWith(".svg")) {
      link.type = "image/svg+xml";
    } else if (faviconHref.endsWith(".jpg") || faviconHref.endsWith(".jpeg")) {
      link.type = "image/jpeg";
    } else if (faviconHref.endsWith(".png")) {
      link.type = "image/png";
    }
  }, [location.pathname]);

  return null;
}

export default DomainRedirect;
