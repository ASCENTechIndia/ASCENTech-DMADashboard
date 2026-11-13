// RTSServicesPendancy.jsx
// RTS Services Wise Pendancy - Dynamic API Integration

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/home-new.css";
import "../styles/rts-services.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dmadashboardapi.nagarkaryavalinew.com/api";

const DHULE_ULB_ID = import.meta.env.VITE_DHULE_ULB_ID || 1670;

export default function RTSServicesPendancy() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // Dropdown options from backend 
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);

  // Selected filter states
  const [selectedVibhag, setSelectedVibhag] = useState("all"); 
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  // Table & summary data from backend
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState({
    totalPrapt: 0,
    totalNikali: 0,
    totalPrambhit: 0,
    totalVilambit: 0,
    nikaliDar: 0,
  });

  // Loading and error states
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Initial Load: Fetch Departments (Vibhag)
  useEffect(() => {
    let isMounted = true;
    const fetchInitialDropdowns = async () => {
      setDropdownLoading(true);
      setError(null);
      try {
        const deptRes = await axios.get(`${API_BASE_URL}/rtsServiceWise/getDepartments`, {
          params: { ulbId: DHULE_ULB_ID },
        });

        if (isMounted) {
          if (deptRes.data?.success && Array.isArray(deptRes.data.data)) {
            setDepartments(deptRes.data.data);
          }
        }
      } catch (err) {
        console.error("Initial dropdowns fetch error:", err);
        if (isMounted) {
          setError("विभाग यादी आणताना अडचण आली.");
        }
      } finally {
        if (isMounted) setDropdownLoading(false);
      }
    };

    fetchInitialDropdowns();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Services when Department changes
  useEffect(() => {
    if (!selectedVibhag || selectedVibhag === "all") {
      setServices([]);
      setSelectedServiceType("all");
      return;
    }

    let isMounted = true;
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rtsServiceWise/getServices`, {
          params: {
            ulbId: DHULE_ULB_ID,
            deptId: selectedVibhag,
          },
        });
        if (isMounted && res.data?.success && Array.isArray(res.data.data)) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error("Services fetch error:", err);
      } finally {
        if (isMounted) setServicesLoading(false);
      }
    };

    setSelectedServiceType("all");
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, [selectedVibhag]);

  // 3. Fetch Table Data & Summary KPI cards when filters change
  useEffect(() => {
    if (!selectedVibhag) {
      setTableData([]);
      setSummary({ totalPrapt: 0, totalNikali: 0, totalPrambhit: 0, totalVilambit: 0, nikaliDar: 0 });
      return;
    }

    let isMounted = true;
    const fetchTableData = async () => {
      setTableLoading(true);
      setError(null);
      try {
        const params = {
          ulbId: DHULE_ULB_ID,
        };
        if (selectedVibhag !== "all") {
          params.deptId = selectedVibhag;
        }
        if (selectedServiceType && selectedServiceType !== "all") {
          params.serviceId = selectedServiceType;
        }

        const res = await axios.get(`${API_BASE_URL}/rtsServiceWise/getTableData`, { params });
        if (isMounted && res.data?.success && res.data.data) {
          setTableData(res.data.data.tableData || []);
          setSummary(res.data.data.summary || {
            totalPrapt: 0,
            totalNikali: 0,
            totalPrambhit: 0,
            totalVilambit: 0,
            nikaliDar: 0,
          });
        }
      } catch (err) {
        console.error("Table data fetch error:", err);
        if (isMounted) {
          setError("डेटा आणताना अडचण आली. कृपया पुन्हा प्रयत्न करा.");
        }
      } finally {
        if (isMounted) setTableLoading(false);
      }
    };

    fetchTableData();
    return () => {
      isMounted = false;
    };
  }, [selectedVibhag, selectedServiceType]);

  // Group table rows by department name for rowSpan display
  const grouped = useMemo(() => {
    const map = {};
    tableData.forEach((row) => {
      const vName = row.vibhagName || "इतर विभाग";
      if (!map[vName]) map[vName] = [];
      map[vName].push(row);
    });
    return map;
  }, [tableData]);

  // Display badges names
  const selectedVibhagName = useMemo(() => {
    if (!selectedVibhag) return "";
    if (selectedVibhag === "all") return "सर्व विभाग";
    const found = departments.find((d) => String(d.deptId) === String(selectedVibhag));
    return found ? found.deptName : "";
  }, [selectedVibhag, departments]);



  return (
    <div className="rts-sp-page">
      <header className="hn-header rts-page-header">
        <div className="hn-header-left">
          <button className="rts-back-btn" onClick={() => navigate(from)} title="मागे जा">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>मागे जा</span>
          </button>
          <img src="/DMC_logo.jpg" alt="DMC Logo" className="hn-header-logo"
            style={{ width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <span className="rts-header-title">
            RTS सेवानिहाय प्रलंबित
          </span>
        </div>

        <div className="hn-header-center">
          <h1 className="hn-header-center-title">Dhule Municipal Corporation</h1>
        </div>

        <div className="hn-header-right" />
      </header>

      <div className="hn-body rts-sp-body">

        {/* ── Filter Bar (3 Dropdowns) ── */}
        <div className="rts-filter-bar">
          {/* 1. Vibhag (Department) */}
          <div className="rts-filter-item">
            <label className="rts-filter-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
              </svg>
              विभाग {dropdownLoading && "(लोड होत आहे...)"}
            </label>
            <div className="rts-filter-select-wrap">
              <select
                className="rts-filter-select"
                value={selectedVibhag}
                onChange={(e) => {
                  setSelectedVibhag(e.target.value);
                  setSelectedServiceType("all");
                }}
              >
                <option value="">-- विभाग निवडा --</option>
                <option value="all">सर्व विभाग</option>
                {departments.map((d) => (
                  <option key={d.deptId} value={d.deptId}>
                    {d.deptName}
                  </option>
                ))}
              </select>
              <svg className="rts-filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Arrow */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="rts-filter-arrow">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>

          {/* 2. Service Type */}
          <div className={`rts-filter-item${(!selectedVibhag || selectedVibhag === "all") ? " rts-filter-item--disabled" : ""}`}>
            <label className="rts-filter-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
              </svg>
              सेवा प्रकार {servicesLoading && "(लोड होत आहे...)"}
            </label>
            <div className="rts-filter-select-wrap">
              <select
                className="rts-filter-select"
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                disabled={!selectedVibhag || selectedVibhag === "all"}
              >
                <option value="all">सर्व सेवा प्रकार</option>
                {services.map((s) => (
                  <option key={s.serviceId} value={s.serviceId}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
              <svg className="rts-filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>


        </div>

        {/* Error Notification */}
        {error && (
          <div className="rts-error-banner">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setSelectedVibhag(selectedVibhag)}
              className="rts-error-retry-btn"
            >
              पुन्हा प्रयत्न करा
            </button>
          </div>
        )}

        {/* Prompt when no Vibhag selected - never shown since default is "all" */}
        {!selectedVibhag && (
          <div className="rts-sp-prompt">
            <div className="rts-sp-prompt-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <p>वरील <strong>विभाग</strong> निवडा — डेटा आपोआप दिसेल</p>
          </div>
        )}

        {/* Loading Indicator */}
        {selectedVibhag && tableLoading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
            <div style={{ fontSize: "14.5px", fontWeight: 600, marginBottom: "8px" }}>⏳ डेटा लोड होत आहे...</div>
            <div style={{ fontSize: "14.5px", color: "#94a3b8" }}>कृपया थोडा वेळ थांबा</div>
          </div>
        )}

        {/* Empty state when query returns no data */}
        {selectedVibhag && !tableLoading && tableData.length === 0 && (
          <div className="rts-sp-prompt">
            <p>या निवडीसाठी कोणताही अर्ज किंवा सेवा डेटा उपलब्ध नाही.</p>
          </div>
        )}

        {/* Stats Grid & Table when data exists */}
        {selectedVibhag && !tableLoading && tableData.length > 0 && (
          <>
            {/* 5 KPI Stat Cards */}
            <div className="rts-stats-grid" style={{ marginBottom: 0, marginTop: 0 }}>
              <div className="rts-stat-card">
                <div className="rts-stat-icon-wrap" style={{ background: "#e8f0ff", color: "#2f6fed" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                  </svg>
                </div>
                <div className="rts-stat-content">
                  <span className="rts-stat-col-tag" style={{ color: "#2f6fed" }}>एकूण प्राप्त</span>
                  <span className="rts-stat-value" style={{ color: "#2f6fed" }}>{summary.totalPrapt}</span>
                  <span className="rts-stat-label">एकूण प्राप्त अर्ज</span>
                </div>
              </div>

              <div className="rts-stat-card">
                <div className="rts-stat-icon-wrap" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <div className="rts-stat-content">
                  <span className="rts-stat-col-tag" style={{ color: "#16a34a" }}>एकूण निकाली</span>
                  <span className="rts-stat-value" style={{ color: "#16a34a" }}>{summary.totalNikali}</span>
                  <span className="rts-stat-label">निकाली केलेले अर्ज</span>
                </div>
              </div>

              <div className="rts-stat-card">
                <div className="rts-stat-icon-wrap" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <div className="rts-stat-content">
                  <span className="rts-stat-col-tag" style={{ color: "#ea580c" }}>एकूण प्रलंबित</span>
                  <span className="rts-stat-value" style={{ color: "#ea580c" }}>{summary.totalPrambhit}</span>
                  <span className="rts-stat-label">प्रलंबित अर्ज</span>
                </div>
              </div>

              <div className="rts-stat-card">
                <div className="rts-stat-icon-wrap" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                </div>
                <div className="rts-stat-content">
                  <span className="rts-stat-col-tag" style={{ color: "#7c3aed" }}>निकाली दर</span>
                  <span className="rts-stat-value" style={{ color: "#7c3aed" }}>
                    {summary.nikaliDar}%
                  </span>
                  <span className="rts-stat-label">निकाली टक्केवारी</span>
                </div>
              </div>

              <div className="rts-stat-card">
                <div className="rts-stat-icon-wrap" style={{ background: "#fee2e2", color: "#dc2626" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                </div>
                <div className="rts-stat-content">
                  <span className="rts-stat-col-tag" style={{ color: "#dc2626" }}>एकूण विलंबित</span>
                  <span className="rts-stat-value" style={{ color: "#dc2626" }}>{summary.totalVilambit}</span>
                  <span className="rts-stat-label">मुदतबाह्य अर्ज</span>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="rts-table-card">
              <div className="rts-table-header">
                <h3 className="rts-table-title">
                  RTS सेवानिहाय प्रलंबित तपशील
                </h3>
                <div className="rts-table-header-badges">
                  <span className="rts-table-count">{tableData.length} सेवा</span>
                  <span className="rts-badge" style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", marginLeft: 0 }}>
                    {selectedVibhagName}
                  </span>

                </div>
              </div>

              {/* Horizontal Scroll Hint on Mobile */}
              <div className="rts-table-scroll-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 4l4-4m0 0l-4-4" />
                </svg>
                डावीकडे / उजवीकडे स्क्रोल करा
              </div>

              <div className="rts-table-wrap">
                <table className="rts-table">
                  <thead>
                    <tr>
                      <th className="rts-th rts-th--navy rts-th-vibhag">विभागाचे नाव</th>
                      <th className="rts-th rts-th--navy rts-th-service">सेवेचे नाव</th>
                      <th className="rts-th rts-th--blue rts-th-prapt">प्राप्त अर्ज</th>
                      <th className="rts-th rts-th--green rts-th-nikali">निकाली</th>
                      <th className="rts-th rts-th--orange rts-th-prambhit">प्रलंबित</th>
                      <th className="rts-th rts-th--red rts-th-vilambit">विलंबित</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(grouped).map(([vName, rows]) =>
                      rows.map((row, idx) => (
                        <tr key={`${row.deptId || vName}-${row.serviceId || idx}`} className={idx % 2 === 0 ? "rts-tr-even" : "rts-tr-odd"}>
                          {idx === 0 && (
                            <td rowSpan={rows.length} className="rts-td-vibhag">
                              {vName}
                            </td>
                          )}
                          <td className="rts-td-service">{row.serviceName}</td>
                          <td className="rts-td-num">
                            <span className="rts-num rts-num--blue">{row.prapt}</span>
                          </td>
                          <td className="rts-td-num">
                            <span className="rts-num rts-num--green">{row.nikali}</span>
                          </td>
                          <td className="rts-td-num">
                            <span className={`rts-num ${row.prambhit > 0 ? "rts-num--orange" : "rts-num--grey"}`}>
                              {row.prambhit}
                            </span>
                          </td>
                          <td className="rts-td-num">
                            <span className={`rts-num ${row.vilambit > 0 ? "rts-num--red" : "rts-num--grey"}`}>
                              {row.vilambit ?? 0}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="rts-tr-total">
                      <td colSpan={2} className="rts-td-total-label">एकूण</td>
                      <td className="rts-td-num"><span className="rts-num rts-num--blue rts-num--lg">{summary.totalPrapt}</span></td>
                      <td className="rts-td-num"><span className="rts-num rts-num--green rts-num--lg">{summary.totalNikali}</span></td>
                      <td className="rts-td-num"><span className={`rts-num rts-num--lg ${summary.totalPrambhit > 0 ? "rts-num--orange" : "rts-num--grey"}`}>{summary.totalPrambhit}</span></td>
                      <td className="rts-td-num"><span className={`rts-num rts-num--lg ${summary.totalVilambit > 0 ? "rts-num--red" : "rts-num--grey"}`}>{summary.totalVilambit}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
