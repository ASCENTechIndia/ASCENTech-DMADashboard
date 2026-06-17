import { summaryData } from "../data/dashboardData";
import { FaFileAlt, FaRupeeSign, FaWallet, FaChartPie } from "react-icons/fa";

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="dma-stat-card">
      <span
        className="dma-stat-icon"
        style={{
          background: `var(--dma-${color}-light)`,
          color: `var(--dma-${color})`,
        }}
      >
        {icon}
      </span>
      <div>
        <p className="dma-stat-label" style={{ color: `var(--dma-${color})` }}>
          {label}
        </p>
        <p className="dma-stat-value" style={{ color: `var(--dma-${color})` }}>
          {value}
        </p>
        <p className="dma-stat-sub">{sub}</p>
      </div>
    </div>
  );
}

function SummaryCards({ data = summaryData }) {
  // Card configuration array
  const cards = [
    {
      label: "Total Demand",
      value: `₹${data.totalDemand.toLocaleString("en-IN")} Cr`,
      sub: "Total Demand (Amount in Cr)",
      icon: <FaFileAlt size={26} />,
      color: "blue",
    },
    {
      label: "Total Collection",
      value: `₹${data.totalCollection.toLocaleString("en-IN")} Cr`,
      sub: "Total Collection (Amount in Cr)",
      icon: <FaRupeeSign size={26} />,
      color: "green",
    },
    {
      label: "Total Outstanding",
      value: `₹${data.totalOutstanding.toLocaleString("en-IN")} Cr`,
      sub: "Total Outstanding (Amount in Cr)",
      icon: <FaWallet size={26} />,
      color: "orange",
    },
    {
      label: "Collection %",
      value: `${data.collectionPercent.toLocaleString("en-IN")} %`,
      sub: "Collection Percentage",
      icon: <FaChartPie size={26} />,
      color: "purple",
    },
  ];

  return (
    <div className="dma-summary-grid">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

export default SummaryCards;
