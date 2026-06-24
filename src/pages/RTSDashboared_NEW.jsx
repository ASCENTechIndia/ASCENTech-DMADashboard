// RTSDashboared_NEW.jsx
import "../styles/dashboard.css";
import "../styles/rts-new.css";

import Header_NEW from "../components/Header_NEW";
import Stats_NEW from "../components/Stats_NEW";
import DashboardCard_NEW from "../components/DashboardCard_NEW";
import Table_NEW from "../components/Table_NEW";
import DashboardFooter_NEW from "../components/DashboardFooter_NEW";

function RTSDashboard_NEW() {
  return (
    <div className="dma-dashboard">
      {/* 1 ── Top Header bar */}
      <Header_NEW title="DMA Dashboard" />

      {/* 2 ── RTS sub-header row */}
      <div className="rts-subheader">
        <div className="rts-subheader-left">
          <span className="rts-subheader-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <h2 className="rts-subheader-title">RTS Dashboard</h2>
        </div>
        <div className="rts-subheader-right">
          <span className="rts-last-updated">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Last Updated: 20 May 2025 04:30 PM
          </span>
          <button className="rts-export-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* 3 ── 7 KPI Summary Cards ─────────────────────────────────── */}
      <Stats_NEW />

      {/* 4 ── Corporation-wise Table ──────────────────────────────── */}
      <DashboardCard_NEW className="rts-table-card">
        <Table_NEW />
      </DashboardCard_NEW>

      {/* 5 ── Footer ──────────────────────────────────────────────── */}
      <DashboardFooter_NEW />
    </div>
  );
}

export default RTSDashboard_NEW;
