// Table_NEW.jsx
// Full-featured RTS dashboard table with:
//   • API integration (RTSULBWiseadd, RTSULBDeptWise, RTSULBServiceWise, RTSStatusWise)
//   • Drill-down: Summary → Department → Service → Status
//   • Pagination (rows per page: 10 / 25 / 50)
//   • Color-coded values matching design image
//   • Total row in tfoot

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

/* ── Inline SVG icons (no external dependency) ──────────────────────── */
const IconBuilding = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <rect x="3" y="7" width="11" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="11" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <path d="M6 10h2M6 13h2M6 16h2M10 10h2M10 13h2M10 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 14h2M16 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconDept = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconService = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ── Column config ──────────────────────────────────────────────────── */
const COL_KEYS = [
  "applicationReceived",
  "approved",
  "authorisationReject",
  "authorisationPending",
  "paymentPending",
  "paymentReceived",
  "certificateIssued",
];

const COL_LABELS = {
  applicationReceived: "Application Received",
  approved: "Approved",
  authorisationReject: "Authorisation Reject",
  authorisationPending: "Authorisation Pending",
  paymentPending: "Payment Pending",
  paymentReceived: "Payment Received",
  certificateIssued: "Certificates Issued",
};

// value color per column (matching design screenshot)
const COL_COLORS = {
  applicationReceived: "#2f6fed",
  approved: "#1fa854",
  authorisationReject: "#e6453c",
  authorisationPending: "#f5891f",
  paymentPending: "#f5891f",
  paymentReceived: "#0ea5c4",
  certificateIssued: "#2f6fed",
};

const KEY_TO_STATUS = {
  applicationReceived: "TOT",
  approved: "AP",
  authorisationReject: "CR",
  authorisationPending: "CP",
  paymentPending: "PP",
  paymentReceived: "NW",
  certificateIssued: "DL",
};

/* ── helpers ────────────────────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

const computeTotals = (rows) => {
  return COL_KEYS.reduce((acc, k) => {
    acc[k] = rows.reduce((s, r) => s + (r[k] || 0), 0);
    return acc;
  }, {});
};

/* ── Pagination component ───────────────────────────────────────────── */
function Pagination({ total, page, rowsPerPage, onPage, onRowsPerPage }) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const pages = [];

  // build page buttons (max 5 visible)
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="rts-pagination-bar">
      <span className="rts-pagination-info">
        Showing {total === 0 ? 0 : (page - 1) * rowsPerPage + 1} to{" "}
        {Math.min(page * rowsPerPage, total)} of {total} entries
      </span>

      <div className="rts-pagination-controls">
        <button
          className="rts-page-btn"
          onClick={() => onPage(1)}
          disabled={page === 1}
          title="First"
        >
          «
        </button>
        <button
          className="rts-page-btn"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          title="Previous"
        >
          ‹
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`rts-page-btn${p === page ? " rts-page-btn--active" : ""}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="rts-page-btn"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          title="Next"
        >
          ›
        </button>
        <button
          className="rts-page-btn"
          onClick={() => onPage(totalPages)}
          disabled={page === totalPages}
          title="Last"
        >
          »
        </button>
      </div>

      <div className="rts-pagination-rows">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPage(Number(e.target.value))}
          className="rts-rows-select"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ── Loading spinner ────────────────────────────────────────────────── */
function Loader() {
  return (
    <div className="rts-loader-wrap">
      <div className="rts-spinner" />
      <span>Loading data…</span>
    </div>
  );
}

/* ── Main Table_NEW ─────────────────────────────────────────────────── */
const Table_NEW = () => {
  /* ─── State: summary (main) ────────────────────────────────────── */
  const [summaryRows, setSummaryRows] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState(null);

  /* ─── Drill-down state ──────────────────────────────────────────── */
  const [view, setView] = useState("summary"); // summary | departments | services | status
  const [selectedCorp, setSelectedCorp] = useState(null);
  const [selectedUlbId, setSelectedUlbId] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedStatusLabel, setSelectedStatusLabel] = useState("");

  const [deptCache, setDeptCache] = useState({});
  const [serviceCache, setServiceCache] = useState({});
  const [statusData, setStatusData] = useState([]);
  const [loadingDrill, setLoadingDrill] = useState(false);

  /* ─── Pagination ────────────────────────────────────────────────── */
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ─── Fetch summary on mount ────────────────────────────────────── */
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await axios.get(`${API_BASE_URL}/dashboard/RTSULBWiseadd`);
        if (!res.data.success) throw new Error(res.data.message || "API error");
        const items = res.data.data || [];
        const formatted = items.map((item) => ({
          corporation: item.VAR_CORPORATION_SHORTNAME || "Unknown",
          ulbId: item.NUM_CORPORATION_ID,
          applicationReceived: Number(item.TOTAL || 0),
          approved: Number(item.APPROVED || 0),
          authorisationReject: Number(item.AUTHORISATION_REJECT || 0),
          authorisationPending: Number(item.AUTHORISATION_PENDING || 0),
          paymentPending: Number(item.PAYMENT_PENDING || 0),
          paymentReceived: Number(item.NEW || 0),
          certificateIssued: Number(item.DELIVERD || 0),
        }));
        setSummaryRows(formatted);
      } catch (err) {
        console.error("fetchSummary error:", err);
        setError(err.message);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, []);

  /* ─── Reset page when view changes ─────────────────────────────── */
  useEffect(() => {
    setPage(1);
  }, [view, selectedCorp, selectedDept]);

  /* ─── Determine current data rows ──────────────────────────────── */
  const currentRows = useMemo(() => {
    if (view === "summary") return summaryRows;
    if (view === "departments") return deptCache[selectedCorp] || [];
    if (view === "services") return serviceCache[`${selectedCorp}_${selectedDept}`] || [];
    return [];
  }, [view, summaryRows, deptCache, serviceCache, selectedCorp, selectedDept]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return currentRows.slice(start, start + rowsPerPage);
  }, [currentRows, page, rowsPerPage]);

  const totals = useMemo(() => computeTotals(currentRows), [currentRows]);

  /* ─── Handlers ──────────────────────────────────────────────────── */
  const handleCorpClick = async (corp, ulbId) => {
    setSelectedCorp(corp);
    setSelectedUlbId(ulbId);
    setView("departments");

    if (!deptCache[corp]) {
      try {
        setLoadingDrill(true);
        const res = await axios.get(`${API_BASE_URL}/dashboard/RTSULBDeptWise?ulbId=${ulbId}`);
        if (!res.data.success) throw new Error(res.data.message || "Dept API error");
        const items = res.data.data || [];
        const formatted = items.map((item) => ({
          department: item.VAR_DEPT_ENGNAME || "Unknown",
          deptId: item.NUM_APPLICATION_DEPTID,
          applicationReceived: Number(item.TOTAL || 0),
          approved: Number(item.APPROVED || 0),
          authorisationReject: Number(item.AUTHORISATION_REJECT || 0),
          authorisationPending: Number(item.AUTHORISATION_PENDING || 0),
          paymentPending: Number(item.PAYMENT_PENDING || 0),
          paymentReceived: Number(item.NEW || 0),
          certificateIssued: Number(item.DELIVERD || 0),
        }));
        setDeptCache((prev) => ({ ...prev, [corp]: formatted }));
      } catch (err) {
        console.error("fetchDept error:", err);
        setError(err.message);
      } finally {
        setLoadingDrill(false);
      }
    }
  };

  const handleDeptClick = async (dept, deptId) => {
    setSelectedDept(dept);
    setSelectedDeptId(deptId);
    setView("services");

    const cacheKey = `${selectedCorp}_${dept}`;
    if (!serviceCache[cacheKey]) {
      try {
        setLoadingDrill(true);
        const res = await axios.get(
          `${API_BASE_URL}/dashboard/RTSULBServiceWise?ulbId=${selectedUlbId}&deptId=${deptId}`
        );
        if (!res.data.success) throw new Error(res.data.message || "Service API error");
        const items = res.data.data || [];
        const formatted = items.map((item) => ({
          service: item.VAR_SERVICE_ENG_NAME || "Unknown",
          applicationReceived: Number(item.TOTAL || 0),
          approved: Number(item.APPROVED || 0),
          authorisationReject: Number(item.AUTHORISATION_REJECT || 0),
          authorisationPending: Number(item.AUTHORISATION_PENDING || 0),
          paymentPending: Number(item.PAYMENT_PENDING || 0),
          paymentReceived: Number(item.NEW || 0),
          certificateIssued: Number(item.DELIVERD || 0),
        }));
        setServiceCache((prev) => ({ ...prev, [cacheKey]: formatted }));
      } catch (err) {
        console.error("fetchService error:", err);
        setError(err.message);
      } finally {
        setLoadingDrill(false);
      }
    }
  };

  const handleStatusClick = async (columnKey) => {
    const status = KEY_TO_STATUS[columnKey];
    if (!status) return;
    setSelectedStatusLabel(COL_LABELS[columnKey]);
    setView("status");

    try {
      setLoadingDrill(true);
      const url = selectedUlbId
        ? `${API_BASE_URL}/dashboard/RTSStatusWise?status=${status}&ulbId=${selectedUlbId}`
        : `${API_BASE_URL}/dashboard/RTSStatusWise?status=${status}`;
      const res = await axios.get(url);
      if (!res.data.success) throw new Error(res.data.message || "Status API error");
      const items = res.data.data || [];
      const formatted = items.map((item) => ({
        department: item.VAR_DEPT_ENGNAME || "Unknown",
        count: Number(item.STATUS || 0),
      }));
      setStatusData(formatted);
    } catch (err) {
      console.error("fetchStatus error:", err);
      setError(err.message);
    } finally {
      setLoadingDrill(false);
    }
  };

  const goToSummary = () => {
    setView("summary");
    setSelectedCorp(null);
    setSelectedUlbId(null);
    setSelectedDept(null);
  };

  const goToDepts = () => {
    setView("departments");
    setSelectedDept(null);
  };

  /* ─── Breadcrumb / title ────────────────────────────────────────── */
  const breadcrumb = () => {
    if (view === "summary") return null;
    const parts = [
      <button key="summary" className="rts-breadcrumb-btn" onClick={goToSummary}>
        Summary
      </button>,
    ];
    if (selectedCorp) {
      parts.push(<span key="sep1" className="rts-breadcrumb-sep">›</span>);
      if (view === "departments") {
        parts.push(<span key="corp" className="rts-breadcrumb-current">{selectedCorp}</span>);
      } else {
        parts.push(
          <button key="corp" className="rts-breadcrumb-btn" onClick={goToDepts}>
            {selectedCorp}
          </button>
        );
      }
    }
    if (selectedDept) {
      parts.push(<span key="sep2" className="rts-breadcrumb-sep">›</span>);
      if (view === "services") {
        parts.push(<span key="dept" className="rts-breadcrumb-current">{selectedDept}</span>);
      } else {
        parts.push(
          <button key="dept" className="rts-breadcrumb-btn" onClick={goToDepts}>
            {selectedDept}
          </button>
        );
      }
    }
    if (view === "status") {
      parts.push(<span key="sep3" className="rts-breadcrumb-sep">›</span>);
      parts.push(<span key="status" className="rts-breadcrumb-current">{selectedStatusLabel}</span>);
    }
    return <div className="rts-breadcrumb">{parts}</div>;
  };

  /* ─── Render error ──────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="rts-error-box">
        <strong>Error:</strong> {error}
        <button className="rts-error-retry" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  /* ─── Render loading ────────────────────────────────────────────── */
  if (loadingSummary) return <Loader />;

  /* ─── Render status table ───────────────────────────────────────── */
  if (view === "status") {
    const statusTotal = statusData.reduce((s, i) => s + i.count, 0);
    return (
      <div>
        {breadcrumb()}
        {loadingDrill ? (
          <Loader />
        ) : (
          <div className="rts-table-scroll">
            <table className="rts-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Sr. No.</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">{selectedStatusLabel}</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{item.department}</td>
                    <td className="text-center" style={{ color: "#2f6fed", fontWeight: 600 }}>
                      {fmt(item.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td>TOTAL</td>
                  <td className="text-center">{fmt(statusTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ─── Determine first column config ────────────────────────────── */
  const firstColLabel =
    view === "summary" ? "Corporation" : view === "departments" ? "Department" : "Service";

  const firstColRender = (row, rowIdx) => {
    if (view === "summary") {
      return (
        <button
          className="rts-corp-link"
          onClick={() => handleCorpClick(row.corporation, row.ulbId)}
        >
          <IconBuilding size={15} />
          {row.corporation}
        </button>
      );
    }
    if (view === "departments") {
      return (
        <button
          className="rts-corp-link"
          onClick={() => handleDeptClick(row.department, row.deptId)}
        >
          <IconDept size={13} />
          {row.department}
        </button>
      );
    }
    return (
      <span className="rts-service-label">
        <IconService size={13} />
        {row.service}
      </span>
    );
  };

  const firstColValue = (row) =>
    view === "summary" ? row.corporation : view === "departments" ? row.department : row.service;

  /* ─── Render main table ─────────────────────────────────────────── */
  return (
    <div>
      {breadcrumb()}

      {loadingDrill ? (
        <Loader />
      ) : (
        <>
          <div className="rts-table-scroll">
            <table className="rts-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Sr. No.</th>
                  <th className="text-center">{firstColLabel}</th>
                  {COL_KEYS.map((k) => (
                    <th key={k} className="text-center">
                      {COL_LABELS[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center rts-no-data">
                      No data available
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-center">
                        {(page - 1) * rowsPerPage + idx + 1}
                      </td>
                      <td>{firstColRender(row, idx)}</td>
                      {COL_KEYS.map((k) => {
                        const val = row[k] || 0;
                        return (
                          <td key={k} className="text-center">
                            <span
                              style={{
                                color: val === 0 ? "#94a3b8" : COL_COLORS[k],
                                fontWeight: val === 0 ? 400 : 600,
                              }}
                            >
                              {fmt(val)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td>TOTAL</td>
                  {COL_KEYS.map((k) => (
                    <td key={k} className="text-center">
                      {fmt(totals[k])}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <Pagination
            total={currentRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPage={(p) => setPage(p)}
            onRowsPerPage={(n) => {
              setRowsPerPage(n);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Table_NEW;
