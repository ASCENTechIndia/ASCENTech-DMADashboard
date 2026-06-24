// Stats_NEW.jsx – Static 7 KPI cards with updated icons + larger size

import SummaryCard_NEW from "./SummaryCard_NEW";

/* ── Inline SVG Icons (matching reference image) ────────────────────── */

/* 1. Corporations – Building with windows */
const IconBuilding = () => (
  <svg width="32" height="32" viewBox="-1 1.5 24 24" fill="none">
    <rect x="2" y="7" width="13" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="15" y="11" width="7" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="5" y="10" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="9.5" y="10" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="5" y="14.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="9.5" y="14.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="17" y="14" width="2" height="2" rx="0.4" fill="currentColor" opacity="0.7" />
    <rect x="17" y="18" width="2" height="2" rx="0.4" fill="currentColor" opacity="0.7" />
    <rect x="7" y="19" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
  </svg>
);

/* 2. Applications Received – Clipboard with checkmark */
const IconClipboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="m8.5 12.5 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* 3. Approved – Circle with tick */
const IconCheckCircle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m7.5 12.5 3 3 5.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* 4. Authorization Pending – Circle with X */
const IconXCircle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m8.5 8.5 7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* 5. Payment Pending – Clock */
const IconClock = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 7v5.5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* 6. Payment Received – Credit card */
const IconCard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    <rect x="5" y="14" width="5" height="2" rx="1" fill="currentColor" opacity="0.7" />
    <circle cx="18" cy="15" r="1.5" fill="currentColor" opacity="0.8" />
  </svg>
);

/* 7. Certificates Issued – Document with badge */
const IconCertificate = () => (
  <svg width="32" height="32" viewBox="-1.5 1 24 24" fill="none">
    <rect x="3" y="2" width="13" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7 7h6M7 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.7" />
    <path d="m15.5 17 1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Static card data ───────────────────────────────────────────────── */
const STATIC_CARDS = [
  {
    icon: <IconBuilding />,
    label: "Corporations",
    value: "8",
    sub: "Total Corporations",
    color: "navy",
  },
  {
    icon: <IconClipboard />,
    label: "Applications Received",
    value: "32,715",
    sub: "Total Received",
    color: "blue",
  },
  {
    icon: <IconCheckCircle />,
    label: "Approved",
    value: "4,053",
    sub: "Total Approved",
    color: "green",
  },
  {
    icon: <IconXCircle />,
    label: "Authorization Pending",
    value: "9,058",
    sub: "Pending",
    color: "red",
  },
  {
    icon: <IconClock />,
    label: "Payment Pending",
    value: "1,506",
    sub: "Pending",
    color: "orange",
  },
  {
    icon: <IconCard />,
    label: "Payment Received",
    value: "3,697",
    sub: "Total Received",
    color: "teal",
  },
  {
    icon: <IconCertificate />,
    label: "Certificates Issued",
    value: "28,071",
    sub: "Total Issued",
    color: "purple",
  },
];

/* ── Stats_NEW component ────────────────────────────────────────────── */
function Stats_NEW() {
  return (
    <div className="rts-stats-grid">
      {STATIC_CARDS.map((card, idx) => (
        <SummaryCard_NEW key={idx} {...card} />
      ))}
    </div>
  );
}

export default Stats_NEW;
