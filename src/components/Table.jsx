import React, { useState } from 'react';
import '../styles/dashboard.css'
const Table = () => {
  // ─── Data ──────────────────────────────────────────────────────────────
  const rowsData = [
    {
      corporation: 'Ahilyanagar',
      applicationReceived: 15620,
      approved: 2292,
      authorisationReject: 670,
      authorisationPending: 328,
      paymentPending: 388,
      paymentReceived: 46,
      certificateIssued: 11896,
    },
    {
      corporation: 'Ichalkaranji',
      applicationReceived: 3006,
      approved: 92,
      authorisationReject: 207,
      authorisationPending: 108,
      paymentPending: 242,
      paymentReceived: 3113,
      certificateIssued: 44,
    },
    {
      corporation: 'Urun Ilampur',
      applicationReceived: 67,
      approved: 1,
      authorisationReject: 3,
      authorisationPending: 7,
      paymentPending: 24,
      paymentReceived: 3,
      certificateIssued: 29,
    },
    {
      corporation: 'Kolhapur',
      applicationReceived: 13,
      approved: 0,
      authorisationReject: 0,
      authorisationPending: 12,
      paymentPending: 1,
      paymentReceived: 0,
      certificateIssued: 0,
    },
    {
      corporation: 'Jalgaon',
      applicationReceived: 352,
      approved: 22,
      authorisationReject: 63,
      authorisationPending: 126,
      paymentPending: 30,
      paymentReceived: 10,
      certificateIssued: 101,
    },
    {
      corporation: 'Dhule',
      applicationReceived: 15527,
      approved: 3,
      authorisationReject: 491,
      authorisationPending: 239,
      paymentPending: 0,
      paymentReceived: 28,
      certificateIssued: 14766,
    },
    {
      corporation: 'Parbhani',
      applicationReceived: 307,
      approved: 0,
      authorisationReject: 112,
      authorisationPending: 39,
      paymentPending: 3,
      paymentReceived: 0,
      certificateIssued: 153,
    },
    {
      corporation: 'Bhivandi Nizampur',
      applicationReceived: 8394,
      approved: 1177,
      authorisationReject: 590,
      authorisationPending: 5947,
      paymentPending: 305,
      paymentReceived: 289,
      certificateIssued: 86,
    },
    {
      corporation: 'Malegaon',
      applicationReceived: 58,
      approved: 0,
      authorisationReject: 3,
      authorisationPending: 46,
      paymentPending: 2,
      paymentReceived: 0,
      certificateIssued: 7,
    },
    {
      corporation: 'Latur',
      applicationReceived: 1306,
      approved: 20,
      authorisationReject: 387,
      authorisationPending: 216,
      paymentPending: 50,
      paymentReceived: 42,
      certificateIssued: 591,
    },
    {
      corporation: 'Sangli',
      applicationReceived: 6396,
      approved: 3,
      authorisationReject: 1,
      authorisationPending: 56,
      paymentPending: 3098,
      paymentReceived: 969,
      certificateIssued: 1469,
    },
  ];

  const totals = {
    corporation: 'TOTAL',
    applicationReceived: 51846,
    approved: 3610,
    authorisationReject: 2527,
    authorisationPending: 7124,
    paymentPending: 4943,
    paymentReceived: 4500,
    certificateIssued: 29142,
  };

  const colKeys = [
    'applicationReceived',
    'approved',
    'authorisationReject',
    'authorisationPending',
    'paymentPending',
    'paymentReceived',
    'certificateIssued',
  ];

  const colLabels = {
    applicationReceived: 'Application Received',
    approved: 'Approved',
    authorisationReject: 'Authorisation Reject',
    authorisationPending: 'Authorisation Pending',
    paymentPending: 'Payment Pending',
    paymentReceived: 'Payment Received',
    certificateIssued: 'Certificate Issued',
  };

  // ─── State for toast ────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleCellClick = (corporation, columnKey, value) => {
    const label = colLabels[columnKey] || columnKey;
    const formatted = value.toLocaleString();
    setToastMessage(`${corporation} · ${label}: ${formatted}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ─── Helper to format numbers ──────────────────────────────────────────
  const formatNumber = (num) => num.toLocaleString();

  // ─── Render ────────────────────────────────────────────────────────────
    return (
<>
      {/* Table – uses the dma-table classes for styling */}
      <div className="dma-card">
        <div className="dma-card-header">
          <div className="dma-card-icon" style={{ background: 'var(--dma-navy)' }}>
            <i className="bi bi-table" style={{ color: '#fff' }}></i>
          </div>
          <h5 className="dma-card-title">RTS Dashboard</h5>
        </div>
        <div className="dma-card-body">
          <div className="dma-table-scroll">
            <table className="dma-table table table-bordered">
              <thead>
                <tr>
                  <th>Corporation</th>
                  <th className="text-center">Application Received</th>
                  <th className="text-center">Approved</th>
                  <th className="text-center">Authorisation Reject</th>
                  <th className="text-center">Authorisation Pending</th>
                  <th className="text-center">Payment Pending</th>
                  <th className="text-center">Payment Received</th>
                  <th className="text-center">Certificate Issued</th>
                </tr>
              </thead>
              <tbody>
                {rowsData.map((row) => (
                  <tr key={row.corporation}>
                    <td className="fw-bold">{row.corporation}</td>
                    {colKeys.map((key) => {
                      const value = row[key];
                      const isZero = value === 0;
                      return (
                        <td key={key} className="text-center">
                          {isZero ? (
                            <span className="text-muted">{formatNumber(value)}</span>
                          ) : (
                            <button
                              className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                              onClick={() => handleCellClick(row.corporation, key, value)}
                              style={{ cursor: 'pointer', color: 'var(--dma-blue)' }}
                            >
                              {formatNumber(value)}
                              <i className="bi bi-chevron-right ms-1 small"></i>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{totals.corporation}</td>
                  {colKeys.map((key) => {
                    const value = totals[key];
                    const isZero = value === 0;
                    return (
                      <td key={key} className="text-center">
                        {isZero ? (
                          <span className="text-muted">{formatNumber(value)}</span>
                        ) : (
                          <button
                            className="btn btn-link btn-sm p-0 text-white text-decoration-none"
                            onClick={() => handleCellClick('TOTAL', key, value)}
                            style={{ cursor: 'pointer', fontWeight: 700 }}
                          >
                            {formatNumber(value)}
                            <i className="bi bi-chevron-right ms-1 small"></i>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-info-circle me-2"></i>
                {toastMessage}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;