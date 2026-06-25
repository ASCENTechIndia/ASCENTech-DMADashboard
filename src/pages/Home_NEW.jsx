// Home_NEW.jsx
// DMA Dashboard – Home page (new design, matches screenshot).
// Fetches cards from API and renders them in a 4-column grid.

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeCard_NEW from "../components/HomeCard_NEW";
import "../styles/home-new.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ── Card metadata list: exact color + route + solid SVG icon by index ── */
const CARD_META_LIST = [
  /* 0: Property Tax */
  {
    color: "blue",
    route: "/propertydashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v2h20V7L12 2zm0 4.18L5.72 7.5 12 8.82 18.28 7.5 12 6.18zM3 11h3v9H3v-9zm6 0h3v9H9v-9zm6 0h3v9h-3v-9zm6 0h3v9h-3v-9zM2 22h20v-2H2v2z"/>
      </svg>
    ),
  },
  /* 1: Water Tax */
  {
    color: "teal",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
  },
  /* 2: Grievances */
  {
    color: "red",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
  },
  /* 3: Estate */
  {
    color: "purple",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z"/>
      </svg>
    ),
  },
  /* 4: CFC */
  {
    color: "green",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  /* 5: Accounts */
  {
    color: "navy",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
  },
  /* 6: Estate */
  {
    color: "orange",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z"/>
      </svg>
    ),
  },
  /* 7: Grievances */
  {
    color: "teal",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
  },
  /* 8: Social Welfare */
  {
    color: "red",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  /* 9: Asset Management */
  {
    color: "purple",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-5l-10 5-10-5v5zM2 12l10 5 10-5V7l-10 5-10-5v5z"/>
      </svg>
    ),
  },
  /* 10: Project Management */
  {
    color: "green",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
  },
  /* 11: Septic Tank */
  {
    color: "purple",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
      </svg>
    ),
  },
  /* 12: Inward Outward */
  {
    color: "orange",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/>
      </svg>
    ),
  },
  /* 13: Birth & Death */
  {
    color: "teal",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  /* 14: Asset Management */
  {
    color: "blue",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    ),
  },
  /* 15: Smart Parking */
  {
    color: "green",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 6.5H10v3h2.5c.83 0 1.5-.67 1.5-1.5S13.33 6.5 12.5 6.5zM19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.5 5c0 1.93-1.57 3.5-3.5 3.5H10v3H8V5h4.5C14.43 5 15.5 6.57 15.5 8z"/>
      </svg>
    ),
  },
  /* 16: Legal */
  {
    color: "purple",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 21H5c-1.1 0-2-.9-2-2v-3h18v3c0 1.1-.9 2-2 2zM12 2a5 5 0 0 0-5 5v7h10V7a5 5 0 0 0-5-5zm2 5h-4V5h4v2z"/>
      </svg>
    ),
  },
  /* 17: Market */
  {
    color: "red",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4L3 12v2c0 .55.45 1 1 1h1v6h10v-6h4v6h2v-6c.55 0 1-.45 1-1zm-9 4H7v-4h5v4z"/>
      </svg>
    ),
  },
  /* 18: Medicine Inventory */
  {
    color: "green",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
      </svg>
    ),
  },
  /* 19: Open Land */
  {
    color: "teal",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
  },
  /* 20: Fire */
  {
    color: "red",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
      </svg>
    ),
  },
  /* 21: Works */
  {
    color: "gold",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    ),
  },
  /* 22: Marriage Registration */
  {
    color: "pink",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  /* 23: Visitor Management */
  {
    color: "blue",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ),
  },
  /* 24: RTS */
  {
    color: "purple",
    route: "/rtsdashboard-new",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
      </svg>
    ),
  },
  /* 25: OPD */
  {
    color: "blue",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
      </svg>
    ),
  },
  /* 26: Digital Library */
  {
    color: "gold",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
      </svg>
    ),
  },
  /* 27: Tanker */
  {
    color: "green",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-3 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5S7.17 17 8 17s1.5.67 1.5 1.5S8.83 18.5 8 18.5zM17 12V9.5l2.25 2.5H17z"/>
      </svg>
    ),
  },
  /* 28: Advertisement */
  {
    color: "purple",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h3l-3 3v1h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 13H7v-2h10v2zm0-3H7v-2h10v2zm0-3H7V7h10v2z"/>
      </svg>
    ),
  },
  /* 29: Bombay Nursing Act */
  {
    color: "teal",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ),
  },
];

/** Default fallback metadata for unknown card indexes/titles */
function getCardMeta(title, index) {
  if (index !== undefined && CARD_META_LIST[index]) {
    return CARD_META_LIST[index];
  }
  // fallback
  return {
    color: "navy",
    route: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  };
}

/** Format current date the way the screenshot shows: "May 24, 2025 / Saturday" */
function getFormattedDate() {
  const now = new Date();
  const opts = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
  const parts = new Intl.DateTimeFormat("en-US", opts).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    date: `${get("month")} ${get("day")}, ${get("year")}`,
    day: get("weekday"),
  };
}

/* ── Skeleton loader grid ──────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="hn-grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div className="hn-skeleton-card" key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div className="hn-skel-circle" />
            <div className="hn-skel-line hn-skel-line--short" style={{ marginBottom: 0 }} />
          </div>
          <div className="hn-skel-line hn-skel-line--full" />
          <div className="hn-skel-line hn-skel-line--full" />
          <div className="hn-skel-line hn-skel-line--short" />
        </div>
      ))}
    </div>
  );
}

/* ── Main Page Component ────────────────────────────────────────────── */
export default function Home_NEW() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { date, day } = getFormattedDate();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/dashboard/DashboardDataNew`);
      setCards(res.data?.data || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCardClick = (card, index) => {
    const meta = getCardMeta(card.title, index);
    if (meta.route) navigate(meta.route);
  };

  return (
    <div className="hn-page">
      {/* ── TOP HEADER ── */}
      <header className="hn-header">
        {/* Left: logo + title */}
        <div className="hn-header-left">
          <img
            src="/Images/AscenTech_Logomini.png"
            alt="AscenTech"
            className="hn-header-logo"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="hn-header-title-wrap">
            <h1 className="hn-header-title">DMA Dashboard</h1>
            <p className="hn-header-subtitle">Digital Municipal Administration</p>
          </div>
        </div>

        {/* Right: Nagar Karyawali logo + date badge */}
        <div className="hn-header-right">
          <img
            src="/Images/MasterPageLogo.png"
            alt="Nagar Karyawali"
            className="hn-brand-logo"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="hn-date-badge">
            {/* Calendar icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{date}</span>
            <span style={{ opacity: 0.7 }}>|</span>
            <span>{day}</span>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="hn-body">
        {loading && <SkeletonGrid />}

        {!loading && error && (
          <div className="hn-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ flex: 1 }}>{error}</span>
            <button className="hn-error-retry" onClick={fetchDashboard}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="hn-grid">
            {cards.map((card, idx) => {
              const meta = getCardMeta(card.title, idx);
              const isClickable = !!meta.route;
              return (
                <HomeCard_NEW
                  key={`${card.code ?? card.title}-${idx}`}
                  title={card.title}
                  color={meta.color}
                  icon={meta.icon}
                  clickable={isClickable}
                  onClick={() => handleCardClick(card, idx)}
                  metrics={card.metrics || []}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
