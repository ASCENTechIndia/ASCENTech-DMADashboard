import { useState, useEffect } from "react";
import { summaryData } from "../data/dashboardData";
import { FaFileAlt, FaRupeeSign, FaWallet, FaChartPie } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

function SummaryCards() {
  const [data, setData] = useState({
    totalDemand: 0,
    totalCollection: 0,
    totalOutstanding: 0,
    collectionPercent: 0
  });

  useEffect(() => {
    const fetchTilesData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property/getTilesData`);
        console.log(response.data);
        if (response.data.success && response.data.data) {
          const apiData = response.data.data;
          setData({
            totalDemand: Number(apiData.TOTAL_DEMAND || 0) / 10000000,
            totalCollection: Number(apiData.TOTAL_COLLECTION || 0) / 10000000,
            totalOutstanding: Number(apiData.TOTAL_OUTSTANDING || 0) / 10000000,
            collectionPercent: Number(apiData.COLLECTION_PERCENTAGE || 0)
          });
        }
      } catch (error) {
        console.error("Error fetching tiles data:", error);
      }
    };
    fetchTilesData();
  }, []);

  // Card configuration array
  const cards = [
    {
      label: "Total Demand",
      value: `₹${data.totalDemand.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`,
      sub: "Total Demand (Amount in Cr)",
      icon: <FaFileAlt size={26} />,
      color: "blue",
    },
    {
      label: "Total Collection",
      value: `₹${data.totalCollection.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`,
      sub: "Total Collection (Amount in Cr)",
      icon: <FaRupeeSign size={26} />,
      color: "green",
    },
    {
      label: "Total Outstanding",
      value: `₹${data.totalOutstanding.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`,
      sub: "Total Outstanding (Amount in Cr)",
      icon: <FaWallet size={26} />,
      color: "orange",
    },
    {
      label: "Collection %",
      value: `${data.collectionPercent.toLocaleString("en-IN", { maximumFractionDigits: 2 })} %`,
      sub: "Collection Percentage",
      icon: <FaChartPie size={26} />,
      color: "purple",
    },
  ];

  return (
    <div className="dma-summary-grid mt-2">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

export default SummaryCards;
