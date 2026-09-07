// CardDetailPage.jsx
// Detail page opened when a Dhule Dashboard card is clicked.
// Each card type has specific column definitions per the Excel reference table:
//   Column 1 = Month (filter)
//   Column 2-5 = specific metric columns per ULB type
//


import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaRupeeSign, FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt, FaPercentage, FaBuilding, FaChartLine, FaMoneyBillWave, FaMoneyCheckAlt, FaCreditCard } from "react-icons/fa";
import * as echarts from "echarts";
import axios from "axios"; 
import "../styles/home-new.css";
import "../styles/card-detail.css";
import { getCardMeta } from "./Dhule_Dashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* cleaned */
const CARD_COLUMNS_MAP = {
  "water":               { cols: ["Total Collection", "Cash", "Cheque", "Online"] },
  "water tax":           { cols: ["Total Demand", "Total Collection", "Cash", "Cheque", "Online"],
                           tableCols: ["Total Collection", "Cash", "Cheque", "Online"] },
  "estate":              { cols: ["Total Properties", "Rented Properties", "Leased Properties", "Vacant Properties"],
                           tableCols: ["Rented Property No.", "Rented Demand", "Rented Collection", "Leased Property No.", "Leased Demand", "Leased Collection"] },
  "social welfare":      { cols: ["Total Application", "Approved Applications", "Reject Application", "Pending Applications"] },
  "inward outward":      { cols: ["Total Inward", "Total Outward", null, null] },
  "bnd":                 { cols: ["Total Received", "Total Approved", "Total Rejected", "Total Pending"] },
  "birth & death":       { cols: ["Total Received", "Total Approved", "Total Rejected", "Total Pending"] },
  "market":              { cols: ["Total Demand", "Total Collection", "Total Outstanding", "Recovery Percentage"] },
  "fire":                { cols: ["Total Applications", "Application Approved", "Application Rejected", "Pending Applications"] },
  "marriage registration": { cols: ["Total Application", "Approved Applications", "Rejected Applications", "Pending Applications"] },
  "marriage":            { cols: ["Total Application", "Approved Applications", "Rejected Applications", "Pending Applications"] },
  "legal":               { cols: ["Total Cases", "Total Closed Cases", "Total Pending Cases", null] },
  "asset management":    { cols: ["Total Assets", "Total Purchased Assets", "Total Issued Assets", "Total Assets Pending for Issue"] },
  "grievances":          { cols: ["Total Complaints", "Resolved", "Pending", "Rejected"] },
  "cfc":                 { cols: ["Total Applications", "Total Demand", "Total Collection", "Recovery Percentage"] },
  "accounts":            { cols: ["Total Budget", "Expenditure", "Revenue", "Balance"] },
  "property tax":        { cols: ["Total Demand", "Total Collection", "Total Outstanding", "Recovery Percentage"] },
  "project management":  { cols: ["Total Projects", "Completed", "In Progress", "Pending"] },
  "septic tank":         { cols: ["Total Requests", "Completed", "Pending", null] },
  "smart parking":       { cols: ["Total Slots", "Occupied", "Available", null] },
  "medicine inventory":  { cols: ["Total Stock", "Issued", "Remaining", null] },
  "open land":           { cols: ["Total Land", "Encroached", "Free", null] },
  "works":               { cols: ["Total Works", "Completed", "Ongoing", "Pending"] },
  "visitor management":  { cols: ["Total Visitors", "Approved", "Pending", null] },
  "rts":                 { cols: ["Total Applications", "Approved", "Pending", "Rejected"] },
  "opd":                 { cols: ["Total Patients", "Treated", "Referred", null] },
  "digital library":     { cols: ["Total Members", "Books Issued", "Books Returned", "Overdue"] },
  "tanker":              { cols: ["Total Trips", "Completed", "Pending", null] },
  "advertisement":       { cols: ["Total Licenses", "Approved", "Pending", null] },
  "bombay nursing act":  { cols: ["Total Registrations", "Active", "Expired", null] },
};

/* Default fallback columns */
const DEFAULT_COLS = ["Total", "Approved", "Pending", "Rejected"];

/* cleaned */
const COLOR_MAP = {
  blue:   { main: "#2f6fed", bg: "#e8f0ff", light: "#a8c4f8", grad: "linear-gradient(135deg,#2f6fed,#1a4fcf)" },
  teal:   { main: "#0ea5c4", bg: "#e0f7fc", light: "#7dd8f0", grad: "linear-gradient(135deg,#0ea5c4,#0e86a0)" },
  green:  { main: "#16a34a", bg: "#dcfce7", light: "#6ee7a0", grad: "linear-gradient(135deg,#16a34a,#0f7a35)" },
  orange: { main: "#f97316", bg: "#fff7ed", light: "#fdba74", grad: "linear-gradient(135deg,#f97316,#d45e00)" },
  red:    { main: "#dc2626", bg: "#fee2e2", light: "#f87171", grad: "linear-gradient(135deg,#dc2626,#b01c1c)" },
  purple: { main: "#7c3aed", bg: "#f5f3ff", light: "#c4b5fd", grad: "linear-gradient(135deg,#7c3aed,#5b21b6)" },
  pink:   { main: "#db2777", bg: "#fce7f3", light: "#f9a8d4", grad: "linear-gradient(135deg,#db2777,#be185d)" },
  gold:   { main: "#d97706", bg: "#fffbeb", light: "#fcd34d", grad: "linear-gradient(135deg,#d97706,#b45309)" },
  navy:   { main: "#102a6b", bg: "#e8edf8", light: "#93a8d4", grad: "linear-gradient(135deg,#102a6b,#0a1c4a)" },
};
 
/* cleaned */
const ALL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_NUM_MAP = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };

function formatMonthYear(d) {
  const mStr = String(d.month ?? d.MONTH ?? '');
  const yStr = String(d.year ?? d.YEAR ?? '');
  if (!mStr) return null;
  let monthName = "";
  if (!isNaN(mStr) && Number(mStr) >= 1 && Number(mStr) <= 12) {
      monthName = ALL_MONTHS[Number(mStr) - 1];
  } else {
      monthName = mStr.charAt(0).toUpperCase() + mStr.slice(1).toLowerCase();
  }
  const yearSuffix = yStr.length >= 2 ? "-" + yStr.slice(-2) : "";
  return monthName + yearSuffix;
}

function getLast6Months() {
  const now = new Date();
  const cur = now.getMonth();
  return Array.from({ length: 6 }, (_, i) => ALL_MONTHS[(cur - 5 + i + 12) % 12]);
}

/* cleaned */
function simulateMonthlyData(cols, metrics, months) {
  return cols.filter(Boolean).map((colLabel, ci) => {
    // Try to match API metric
    const apiMetric = metrics.find(m =>
      m.label?.toLowerCase().includes(colLabel?.toLowerCase().split(" ")[1] || colLabel?.toLowerCase().split(" ")[0])
    );
    const baseVal = apiMetric
      ? Number(String(apiMetric.value).replace(/,/g, "")) || (200 + ci * 100)
      : (200 + ci * 150);

    return {
      name: colLabel,
      data: months.map((_, mi) => {
        const seed = (mi * 7 + ci * 13) % 17;
        const noise = 0.65 + (seed / 17) * 0.7;
        return Math.max(0, Math.round(baseVal * noise * (1 + mi * 0.02)));
      }),
    };
  });
}

/* cleaned */
function getColValue(colLabel, metrics) {
  if (!colLabel) return null;
  const match = metrics.find(m =>
    m.label?.toLowerCase() === colLabel.toLowerCase() ||
    m.label?.toLowerCase().includes(colLabel.toLowerCase().split(" ").slice(-1)[0])
  );
  if (match) return match.value;
  // Simulate a plausible number
  const hash = colLabel.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 9000 + 1000).toLocaleString("en-IN");
}

/* cleaned */
  function fmtNum(v) {
    const n = Number(String(v).replace(/,/g, ""));
    if (isNaN(n)) return v;
    if (n >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000)   return (n / 100000).toFixed(2) + " L";
    // Values below 1 lakh → show actual number (no 'k' shorthand)
    return n.toLocaleString("en-IN");
  }

  function formatCurrency(v) {
    // fmtNum already handles Cr / L / actual number correctly
    return `\u20B9 ${fmtNum(v)}`;
  }

/* cleaned */
function getStatIcon(label, index, titleKey) {
  const lower = label.toLowerCase();
  
  if (titleKey && titleKey.includes("water")) {
    if (lower.includes("cash")) return <FaMoneyBillWave size={20} style={{ display: "block" }} />;
    if (lower.includes("cheque")) return <FaMoneyCheckAlt size={20} style={{ display: "block" }} />;
    if (lower.includes("online")) return <FaCreditCard size={20} style={{ display: "block" }} />;
  }

  if (lower.includes("approved") || lower.includes("completed")) {
    return <FaCheckCircle size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("reject")) {
    return <FaTimesCircle size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("pending") || lower.includes("outstanding") || lower.includes("balance")) {
    return <FaClock size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("application") || lower.includes("request") || lower.includes("form") || lower.includes("project") || lower.includes("received")) {
    return <FaFileAlt size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("percentage")) {
    return <FaPercentage size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("properties") || lower.includes("estate") || lower.includes("shop")) {
    return <FaBuilding size={20} style={{ display: "block" }} />;
  }
  if (lower.includes("demand") || lower.includes("budget") || lower.includes("revenue") || lower.includes("collection")) {
    return <FaRupeeSign size={20} style={{ display: "block" }} />;
  }
  
  // Default icons array for fallbacks
  const fallbackIcons = [
    <FaChartLine size={20} style={{ display: "block" }} />,
    <FaFileAlt size={20} style={{ display: "block" }} />,
    <FaClock size={20} style={{ display: "block" }} />,
    <FaBuilding size={20} style={{ display: "block" }} />
  ];
  return fallbackIcons[index % fallbackIcons.length];
}

const STAT_COLORS = [
  { main: "#2f6fed", bg: "#e8f0ff" },
  { main: "#16a34a", bg: "#dcfce7" },
  { main: "#f97316", bg: "#fff7ed" },
  { main: "#7c3aed", bg: "#f5f3ff" },
];

/* cleaned */
function BarChart({ cols, metrics, color, months, apiData }) {
  const ref = useRef(null);
  const palette = COLOR_MAP[color] || COLOR_MAP.blue;
  
  const series = cols.map(colLabel => {
    return {
      name: colLabel,
      data: months.map((m) => {
        const apiRow = (apiData || []).find(d => {
          return formatMonthYear(d) === m;
        }) || {};
        
        const matchedKey = matchApiColumn(apiRow, colLabel);
        return matchedKey ? Number(apiRow[matchedKey]) || 0 : 0;
      })
    };
  });

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, null, { renderer: "svg" });
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderColor: "#e2e8f0",
        textStyle: { color: "#1e293b", fontSize: 12 },
        axisPointer: { type: "shadow", shadowStyle: { color: "rgba(0,0,0,0.03)" } },
        formatter: function (params) {
          let html = `<div style="font-weight:600;margin-bottom:5px;">${params[0].name}</div>`;
          params.forEach(p => {
            const isPerc = p.seriesName.toLowerCase().includes("percentage");
            const isCurrency = /demand|collection|outstanding|budget|expenditure|revenue|balance|cash|cheque|online/i.test(p.seriesName);
            let val = p.value;
            if (isPerc) val = `${val}%`;
            else if (isCurrency) val = formatCurrency(val);
            else val = Number(val).toLocaleString("en-IN");
            html += `<div style="display:flex;justify-content:space-between;align-items:center;gap:15px;">
              <span>${p.marker} ${p.seriesName}</span>
              <span style="font-weight:bold;">${val}</span>
            </div>`;
          });
          return html;
        }
      },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 11, color: "#64748b" }
      },
      grid: { left: "3%", right: "4%", bottom: "12%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#64748b", margin: 12 }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
        axisLabel: { color: "#64748b" }
      },
      series: cols.map((col, i) => ({
        name: col,
        type: "bar",
        barMaxWidth: 24,
        itemStyle: {
          color: i === 0 ? palette.main : i === 1 ? "#38bdf8" : i === 2 ? "#fbbf24" : "#a78bfa",
          borderRadius: [4, 4, 0, 0]
        },
        data: series[i]?.data || []
      }))
    };
    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [cols, metrics, color, months, palette]);

  return <div ref={ref} className="cd-chart-container" />;
}



function getDateTime() {
  const now = new Date();
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let h = now.getHours(); const am = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${now.getDate()} ${M[now.getMonth()]} ${now.getFullYear()} ${String(h).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")} ${am}`;
}

// Helper to intelligently match frontend column names (e.g. "Total Inward") to DB keys (e.g. "inward")
function matchApiColumn(apiRow, colLabel) {
  if (!apiRow) return null;
  const lowerCol = (colLabel || "").toLowerCase().trim();
  const keys = Object.keys(apiRow);
  
  // 0. Custom exact mappings for known DB vs UI differences
  const customMap = {
    "total received": "total",
    "total rejected": "total_reject",
    "leased properties": "shop",
    "vacant properties": "empty",
    "total collection": "total_collection",
    "total demand": "total_demand",
    "recovery percentage": "rec_per",
    "rented property no.": "rented_propno",
    "leased property no.": "leased_propno",
    "rented demand": "rented_demand",
    "rented collection": "rented_collection",
    "leased demand": "leased_demand",
    "leased collection": "leased_collection",
  };
  if (customMap[lowerCol] && keys.includes(customMap[lowerCol])) {
    return customMap[lowerCol];
  }
  
  // Also try to find exact "collection" if "total collection" was requested but only "collection" exists
  if (lowerCol === "total collection" && keys.includes("collection") && !keys.includes("total_collection")) {
    return "collection";
  }
  if (lowerCol === "total demand" && keys.includes("demand") && !keys.includes("total_demand")) {
    return "demand";
  }
  
  // 1. Exact match ignoring spaces and underscores
  let match = keys.find(k => k.toLowerCase().replace(/_/g, '') === lowerCol.replace(/\s+/g, ''));
  if (match) return match;
  
  // 2. Remove common prefixes and exact match
  let coreName = lowerCol.replace(/^(total\s+|no\.\s+of\s+|number\s+of\s+)/, '').replace(/\s+/g, '');
  if (coreName) {
    match = keys.find(k => k.toLowerCase().replace(/_/g, '') === coreName);
    if (match) return match;
    
    // 3. Remove common prefixes and check for substring match
    match = keys.find(k => k.toLowerCase().includes(coreName));
    if (match) return match;
    
    // 3.5 Try basic stemming (e.g. "rejected" -> "reject")
    if (coreName.endsWith('ed')) {
      const stem = coreName.slice(0, -2);
      match = keys.find(k => k.toLowerCase().includes(stem));
      if (match) return match;
    }
  }
  
  // 4. Check for any unique word match
  const genericWords = ["total", "of", "no.", "number", "applications", "application", "properties"];
  const words = lowerCol.split(" ").filter(w => !genericWords.includes(w));
  for (let i = words.length - 1; i >= 0; i--) {
    if (!words[i]) continue;
    match = keys.find(k => k.toLowerCase().includes(words[i]));
    if (match) return match;
    
    if (words[i].endsWith('ed')) {
      match = keys.find(k => k.toLowerCase().includes(words[i].slice(0, -2)));
      if (match) return match;
    }
  }
  
  // 5. Fallback: first word match
  const firstWord = lowerCol.split(" ")[0];
  if (firstWord === "total" && keys.includes("total")) {
    // If fallback is 'total', prefer the exact 'total' key if it exists, rather than the first key containing 'total'
    return "total";
  }
  return firstWord ? keys.find(k => k.toLowerCase().includes(firstWord)) : null;
}

export default function CardDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cardKey } = useParams();

  const state      = location.state || {};
  let recoveredTitle = "Details";
  if (cardKey) {
    if (cardKey === "birth--death" || cardKey === "birth-death") {
      recoveredTitle = "Birth & Death";
    } else {
      recoveredTitle = cardKey.replace(/-/g, ' ');
    }
  }
  const title      = state.title   || recoveredTitle;
  const color      = state.color   || "blue";
  const metrics    = state.metrics || [];
  const ulbId      = state.ulbId   || import.meta.env.VITE_DHULE_ULB_ID || 1670;  // Dhule passes ulbId=1670 via navigation state, fallback to env or 1670
  
  const meta       = getCardMeta(title);
  const icon       = meta.icon || null;

  const palette    = COLOR_MAP[color] || COLOR_MAP.blue;
  const [dateTime] = useState(getDateTime());
  const months6    = getLast6Months();
  const [activeMonth, setActiveMonth] = useState(null);

  const titleKey   = title.toLowerCase().trim();
  const colConfig  = CARD_COLUMNS_MAP[titleKey] || null;
  const cols       = colConfig ? colConfig.cols : DEFAULT_COLS;
  const activeCols = cols.filter(Boolean);
  // For modules with separate table columns (e.g. Estate: stats = property counts, table = demand/collection)
  const tableActiveCols = (colConfig?.tableCols || []).filter(Boolean).length > 0
    ? colConfig.tableCols.filter(Boolean)
    : activeCols;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState([]);
  // Water Tax Total Demand fetched from aowt_billprint_mas (already in Crores)
  const [watTotalDemandCr, setWatTotalDemandCr] = useState(null);
  // Estate property stats fetched from aost_prop_mas
  const [estateStats, setEstateStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/MonthwiseFetch`, {
          params: { ulbId, flag: titleKey }
        });
        if (res.data?.success) {
          const rawData = res.data.data || [];
            // Assuming the DB returns all valid historical data for this ULB and flag,
            // we should not arbitrarily filter out years before 2026.
            const filteredData = rawData.map(d => {
              const item = { ...d };
              // Water fallback: Calculate total_collection if it is missing
              if (item.cash_collection !== undefined && item.cheque_collection !== undefined && item.online_collection !== undefined && item.total_collection === undefined) {
                item.total_collection = Number(item.cash_collection) + Number(item.cheque_collection) + Number(item.online_collection);
                // Ensure it's rounded correctly to avoid floating point precision issues
                item.total_collection = Number(item.total_collection.toFixed(2));
              }

              // Market / Tax modules fallback: compute missing totals if API returns 0
              if (item.demand !== undefined && item.collection !== undefined) {
                if (!item.total_demand || item.total_demand === 0) {
                  item.total_demand = Number(item.demand || 0) + Number(item.arrears || 0);
                }
                if (!item.total_collection || item.total_collection === 0) {
                  item.total_collection = Number(item.collection || 0);
                }
                if (item.outstanding === undefined || item.outstanding === 0) {
                  item.outstanding = Math.max(0, item.total_demand - item.total_collection);
                }
                if (!item.recovery_percentage || item.recovery_percentage === 0) {
                  item.recovery_percentage = item.total_demand > 0 ? Number(((item.total_collection / item.total_demand) * 100).toFixed(2)) : 0;
                }
              }

              return item;
            }).filter(d => {
              const y = Number(d.year ?? d.YEAR ?? 0);
              return y > 0; // Or just return true to accept all data returned by DB
            });
          setApiData(filteredData);
        } else {
          setError(res.data?.message || "Failed to load data");
        }
      } catch (err) {
        console.error("Monthwise fetch error:", err);
        setError(err.response?.data?.message || err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [titleKey]);

  // Fetch Water Tax Total Demand separately from aowt_billprint_mas
  useEffect(() => {
    if (titleKey !== 'water tax') return;
    const fetchWatDemand = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/WaterTaxTotalDemand`, {
          params: { ulbId, fromDate: '01-Apr-2026' }
        });
        if (res.data?.success) {
          setWatTotalDemandCr(res.data.data?.demand ?? null);
        }
      } catch (err) {
        console.error('Water Tax Total Demand fetch error:', err);
      }
    };
    fetchWatDemand();
  }, [titleKey, ulbId]);

  // Fetch Estate property stats separately from aost_prop_mas
  useEffect(() => {
    if (titleKey !== 'estate') return;
    const fetchEstate = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/EstateStats`, {
          params: { ulbId }
        });
        if (res.data?.success) {
          setEstateStats(res.data.data ?? null);
        }
      } catch (err) {
        console.error('Estate Stats fetch error:', err);
      }
    };
    fetchEstate();
  }, [titleKey, ulbId]);

  // Oracle may return month as number (1-12), short name ('Jan'), or uppercase key ('MONTH')

  // Use all months from database and include year
  const displayMonths = apiData.length > 0 ? Array.from(new Set(apiData.map(d => formatMonthYear(d)).filter(Boolean))) : months6;

  const tableRows = displayMonths.map((m) => {
    const apiRow = apiData.find(d => formatMonthYear(d) === m) || {};
    return {
      month: m,
      values: tableActiveCols.map(col => {
        const matchedKey = matchApiColumn(apiRow, col);
        return matchedKey ? Number(apiRow[matchedKey]) || 0 : 0;
      })
    };
  });

  const statCards = activeCols.map(col => {
    let totalVal = 0;
    
    const rowsToProcess = activeMonth 
      ? apiData.filter(d => formatMonthYear(d) === activeMonth)
      : apiData;

    // Special handling for percentages so we don't naively sum them
    if (col.toLowerCase().includes("percentage")) {
      // Find Demand and Collection columns to calculate overall percentage
      let sumDemand = 0;
      let sumCollection = 0;
      let sumPercentage = 0;
      let count = 0;
      
      rowsToProcess.forEach(apiRow => {
        const demandKey = matchApiColumn(apiRow, "Total Demand");
        const collKey = matchApiColumn(apiRow, "Total Collection");
        const percKey = matchApiColumn(apiRow, col);
        
        if (demandKey && collKey) {
           sumDemand += Number(apiRow[demandKey]) || 0;
           sumCollection += Number(apiRow[collKey]) || 0;
        } else if (percKey) {
           sumPercentage += Number(apiRow[percKey]) || 0;
           count++;
        }
      });
      
      if (sumDemand > 0) {
        totalVal = (sumCollection / sumDemand) * 100;
      } else if (count > 0) {
        totalVal = sumPercentage / count; // Fallback to average
      }
    } else {
      // Normal summation for other columns
      rowsToProcess.forEach(apiRow => {
        const matchedKey = matchApiColumn(apiRow, col);
        if (matchedKey) {
           totalVal += Number(apiRow[matchedKey]) || 0;
        }
      });
    }

    // For Estate: override each property count stat from direct aost_prop_mas query
    if (titleKey === 'estate' && estateStats !== null) {
      const lc = col.toLowerCase();
      if (lc === 'total properties')  totalVal = estateStats.total_properties;
      if (lc === 'rented properties') totalVal = estateStats.rented_properties;
      if (lc === 'leased properties') totalVal = estateStats.lease_properties;
      if (lc === 'vacant properties') totalVal = estateStats.vacant_properties;
    }

    // For Water Tax: override Total Demand with the direct billprint query result (already in Cr)
    if (titleKey === 'water tax' && col.toLowerCase() === 'total demand' && watTotalDemandCr !== null) {
      totalVal = watTotalDemandCr * 10000000; // Convert Cr back to raw so fmtNum renders "X Cr"
    }

    return {
      label: col,
      value: Number(totalVal.toFixed(2)) || 0,
    };
  });

  return (
    <div className={`cd-page cd-accent-${color}`}>
      <header className="cd-header">
        <div className="cd-header-left">
          <img
            src="/DMC_logo.jpg"
            alt="DMC Logo"
            className="cd-header-logo"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <div className="cd-header-title-wrap">
            <div className="cd-header-icon" style={{ background: palette.bg, color: palette.main }}>
              {icon || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              )}
            </div>
            <div>
              <h1 className="cd-header-title">{title}</h1>
            </div>
          </div>
        </div>
        <div className="cd-date-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Last Updated: {dateTime}
        </div>
      </header>

      <div className="cd-body">
        <div className="cd-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="cd-back-btn" onClick={() => navigate(-1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <p className="cd-section-title" style={{ color: palette.main, margin: 0 }}>
              Current Status Overview
            </p>
          </div>
          <div className="cd-month-dropdown-wrap">
            <select
              id="month-select"
              className="cd-month-select"
              value={activeMonth || ""}
              onChange={(e) => setActiveMonth(e.target.value || null)}
              style={{ "--focus-color": palette.main }}
            >
              <option value="">All Months</option>
              {displayMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="cd-month-dropdown-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div className="cd-stats-grid">
          {statCards.map((sc, i) => {
            const numVal = Number(String(sc.value).replace(/,/g, ""));
            const cardColor = STAT_COLORS[i % STAT_COLORS.length];
            
            let displayValue = sc.value;
            let subtitle = "";
            
            if (!isNaN(numVal)) {
              const lowerLabel = sc.label.toLowerCase();
              const isPercentage = lowerLabel.includes("percentage");
              const isCurrency = /demand|collection|outstanding|budget|expenditure|revenue|balance|cash|cheque|online/i.test(lowerLabel);
              
              if (isPercentage) {
                displayValue = `${numVal}%`;
              } else if (isCurrency) {
                displayValue = formatCurrency(numVal);
                // subtitle is determined by actual magnitude, not hardcoded
                if (numVal >= 10000000) subtitle = "(Amount in Cr)";
                else if (numVal >= 100000) subtitle = "(Amount in L)";
              } else {
                displayValue = numVal.toLocaleString("en-IN");
              }
            }

            return (
              <div key={i} className="cd-stat-card">
                <div
                  className="cd-stat-icon-wrap"
                  style={{ background: cardColor.bg, color: cardColor.main }}
                >
                  {getStatIcon(sc.label, i, titleKey)}
                </div>
                <div className="cd-stat-content">
                  <div className="cd-stat-col-tag" style={{ color: cardColor.main }}>
                    {sc.label}
                  </div>
                  <div className="cd-stat-value" style={{ color: cardColor.main }}>
                    {displayValue}
                  </div>
                  <div className="cd-stat-label">
                    {sc.label} {subtitle && subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>Loading Monthwise Data...</div>}
        {error && <div style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>{error}</div>}

        {!loading && !error && (
        /* cleaned */
        <div className="cd-main-row">
          
          {/* LEFT COLUMN: Summary Table */}
          <div className="cd-table-section">
            <div className="cd-table-card">
              <div className="cd-table-header">
                <h3 className="cd-table-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M3 15h18M9 3v18"/>
                  </svg>
                  {title} - Monthly Summary
                </h3>
                <span className="cd-table-count">{tableRows.length} Months</span>
              </div>
              <div className="cd-table-wrap">
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      {tableActiveCols.map((col, ci) => (
                        <th key={ci}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeMonth
                      ? tableRows.filter(r => r.month === activeMonth)
                      : tableRows
                    ).map((row, ri) => (
                      <tr key={ri} className={activeMonth === row.month ? "cd-tr-active" : ""}>
                        <td>
                          <span
                            className="cd-month-pill"
                            style={{ background: palette.bg, color: palette.main }}
                          >
                            {row.month}
                          </span>
                        </td>
                         {row.values.map((val, vi) => {
                            const colName = tableActiveCols[vi];
                            const isPercentage = colName.toLowerCase().includes("percentage");
                            const isCurrency = /demand|collection|outstanding|budget|expenditure|revenue|balance|cash|cheque|online/i.test(colName);
                            
                            let formattedVal;
                            if (isPercentage) {
                              formattedVal = `${val}%`;
                            } else if (isCurrency) {
                              formattedVal = fmtNum(val);
                            } else {
                              formattedVal = val.toLocaleString("en-IN");
                            }
                            return (
                              <td key={vi}>
                                <span className="cd-table-value">
                                  {formattedVal}
                                </span>
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                    {/* TOTAL ROW */}
                    {tableRows.length > 0 && (
                      <tr style={{ fontWeight: "bold", background: "#f8fafc" }}>
                        <td>Total</td>
                          {tableActiveCols.map((colName, ci) => {
                            const isPercentage = colName.toLowerCase().includes("percentage");
                            let total = 0;
                            
                            if (isPercentage) {
                              const demandIdx = tableActiveCols.findIndex(c => c.toLowerCase().includes("demand"));
                              const collIdx = tableActiveCols.findIndex(c => c.toLowerCase().includes("collection"));
                              if (demandIdx >= 0 && collIdx >= 0) {
                                const sumDemand = tableRows.reduce((sum, row) => sum + (row.values[demandIdx] || 0), 0);
                                const sumColl = tableRows.reduce((sum, row) => sum + (row.values[collIdx] || 0), 0);
                                total = sumDemand > 0 ? (sumColl / sumDemand) * 100 : 0;
                              } else {
                                const sumPerc = tableRows.reduce((sum, row) => sum + (row.values[ci] || 0), 0);
                                total = tableRows.length > 0 ? sumPerc / tableRows.length : 0;
                              }
                            } else {
                              total = tableRows.reduce((sum, row) => sum + (row.values[ci] || 0), 0);
                            }
                            
                            const isCurrency = /demand|collection|outstanding|budget|expenditure|revenue|balance|cash|cheque|online/i.test(colName);
                            let displayTotal = total === 0 ? "0" : Number.isInteger(total) ? total : total.toFixed(2);
                            
                            if (isPercentage) {
                              displayTotal = `${displayTotal}%`;
                            } else if (isCurrency) {
                              displayTotal = fmtNum(total);
                            } else {
                              displayTotal = Number(total).toLocaleString("en-IN");
                            }
                            
                            return (
                              <td key={ci} style={{ color: palette.main }}>
                                {displayTotal}
                              </td>
                            );
                          })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Graph */}
          <div className="cd-charts-section">
            <div className="cd-chart-card">
              <div className="cd-chart-header">
                <h3 className="cd-chart-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
                    <path d="M5 9v11H1V9h4zm9-5v16h-4V4h4zm9 8v8h-4v-8h4z"/>
                  </svg>
                  Monthly Trend - {activeMonth ? activeMonth : "All Months"}
                </h3>
              </div>
              <BarChart cols={tableActiveCols} metrics={metrics} color={color} months={activeMonth ? [activeMonth] : displayMonths} apiData={apiData} />
            </div>
          </div>

        </div>
        )}

      </div>
    </div>
  );
}









