import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DHULE_DOMAIN = import.meta.env.VITE_DHULE_DOMAIN || "dashboard.dhulecorporation.in";
const LATUR_DOMAIN = import.meta.env.VITE_LATUR_DOMAIN || "dashboard.mclatur.in";
const MBMC_DOMAIN = import.meta.env.VITE_MBMC_DOMAIN || "dashboard.mbmc.gov.in";

function DomainRedirect() {
  const location = useLocation();

  // Update document title and favicon according to domain or pathname/query
  useEffect(() => {
    const hostname = window.location.hostname;
    const path = location.pathname;
    const search = location.search;

    let title = "dma-dashboard";
    let faviconHref = "/favicon.svg";

    if (
      hostname.includes("dhulecorporation.in") ||
      hostname === DHULE_DOMAIN ||
      search.includes("1670")
    ) {
      title = "Dhule-dashboard";
      faviconHref = "/DMC_logo.jpg";
    } else if (
      hostname.includes("mclatur.in") ||
      hostname === LATUR_DOMAIN ||
      search.includes("1610")
    ) {
      title = "Latur Municipal Corporation Dashboard";
      faviconHref = "/latur_logo.jpg";
    } else if (
      hostname.includes("mbmc.gov.in") ||
      hostname === MBMC_DOMAIN ||
      search.includes("1710") ||
      search.includes("890")
    ) {
      title = "Mira Bhaindar Municipal Corporation Dashboard";
      faviconHref = "/mbmc_logo.png";
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
  }, [location.pathname, location.search]);

  return null;
}

export default DomainRedirect;
