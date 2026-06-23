import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Table = () => {
  // ─── Main summary data ──────────────────────────────────────────────────
  const [rowsData, setRowsData] = useState([]);
  const [totals, setTotals] = useState({
    corporation: 'TOTAL',
    applicationReceived: 0,
    approved: 0,
    authorisationReject: 0,
    authorisationPending: 0,
    paymentPending: 0,
    paymentReceived: 0,
    certificateIssued: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasMoreThanMax = rowsData.length > 10;

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/dashboard/RTSULBWiseadd`);
        console.log("res", response);
        if (!response.data.success) {
          throw new Error(`${response.message}`);
        }
        const items = Array.isArray(response.data) ? response.data.data : (response.data.data || []);
        const computedTotals = {
          corporation: 'TOTAL',
          applicationReceived: 0,
          approved: 0,
          authorisationReject: 0,
          authorisationPending: 0,
          paymentPending: 0,
          paymentReceived: 0,
          certificateIssued: 0,
        };

        const formattedItems = items.map(item => {
          const formattedItem = {
            corporation: item.VAR_CORPORATION_SHORTNAME || 'Unknown',
            applicationReceived: Number(item.TOTAL || 0),
            approved: Number(item.APPROVED || 0),
            authorisationReject: Number(item.AUTHORISATION_REJECT || 0),
            authorisationPending: Number(item.AUTHORISATION_PENDING || 0),
            paymentPending: Number(item.PAYMENT_PENDING || 0),
            paymentReceived: Number(item.NEW || 0),
            certificateIssued: Number(item.DELIVERD || 0),
          };

          computedTotals.applicationReceived += formattedItem.applicationReceived;
          computedTotals.approved += formattedItem.approved;
          computedTotals.authorisationReject += formattedItem.authorisationReject;
          computedTotals.authorisationPending += formattedItem.authorisationPending;
          computedTotals.paymentPending += formattedItem.paymentPending;
          computedTotals.paymentReceived += formattedItem.paymentReceived;
          computedTotals.certificateIssued += formattedItem.certificateIssued;

          return formattedItem;
        });

        setRowsData(formattedItems);
        setTotals(computedTotals);
      } catch (err) {
        console.error("Error fetching RTSULBWise data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

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

  // ─── Department data for each corporation ──────────────────────────────
  const departmentData = {
    Ahilyanagar: [
      { department: 'Fire Department / অগ্নিশাখা বিলাম', applicationReceived: 61, approved: 17, authorisationReject: 16, authorisationPending: 0, paymentPending: 4, paymentReceived: 6, certificateIssued: 18 },
      { department: 'Property Tax Department (বৈধত্ব বিলাম)', applicationReceived: 647, approved: 405, authorisationReject: 96, authorisationPending: 0, paymentPending: 16, paymentReceived: 0, certificateIssued: 130 },
      { department: 'Construction Department / পদ / খাদ্যশালা বিলাম (Pwd)', applicationReceived: 12, approved: 2, authorisationReject: 6, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 4 },
      { department: 'Trade License', applicationReceived: 91, approved: 34, authorisationReject: 52, authorisationPending: 1, paymentPending: 3, paymentReceived: 0, certificateIssued: 1 },
      { department: 'Solid Waste Management Department (পদকাশনী মজুমদার বিলাম)', applicationReceived: 407, approved: 2, authorisationReject: 13, authorisationPending: 9, paymentPending: 0, paymentReceived: 11, certificateIssued: 372 },
      { department: 'Bombay Nursing Act', applicationReceived: 44, approved: 33, authorisationReject: 2, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 9 },
      { department: 'Water Supply Department / পদশী বিলাম', applicationReceived: 433, approved: 124, authorisationReject: 67, authorisationPending: 0, paymentPending: 6, paymentReceived: 0, certificateIssued: 236 },
      { department: 'NOC Department', applicationReceived: 133, approved: 40, authorisationReject: 57, authorisationPending: 1, paymentPending: 2, paymentReceived: 7, certificateIssued: 26 },
      { department: 'Birth And Death Department / জন্ম-নমূণ বিলাম', applicationReceived: 13706, approved: 1614, authorisationReject: 316, authorisationPending: 317, paymentPending: 355, paymentReceived: 22, certificateIssued: 11082 },
      { department: 'Marriage Registration Dept.', applicationReceived: 40, approved: 4, authorisationReject: 33, authorisationPending: 0, paymentPending: 2, paymentReceived: 0, certificateIssued: 1 },
      { department: 'Town Planning Department / পদশনী বিলাম', applicationReceived: 47, approved: 17, authorisationReject: 12, authorisationPending: 1, paymentPending: 0, paymentReceived: 0, certificateIssued: 17 },
    ],
    // Placeholder for other corporations – replace with real data
    Ichalkaranji: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    'Urun Ilampur': [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Kolhapur: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Jalgaon: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Dhule: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Parbhani: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    'Bhivandi Nizampur': [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Malegaon: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Latur: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
    Sangli: [{ department: 'Sample Dept', applicationReceived: 100, approved: 50, authorisationReject: 10, authorisationPending: 5, paymentPending: 20, paymentReceived: 15, certificateIssued: 0 }],
  };

  // ─── Service data for each department ──────────────────────────────────
  // Structure: serviceData[corpName][deptName] = array of services
  const serviceData = {
    Ahilyanagar: {
      'Fire Department / অগ্নিশাখা বিলাম': [
        { service: 'अधिक्षमन अंतिम नगरकर्ता दाखला देणे - To issue final Fire NOC', applicationReceived: 15, approved: 4, authorisationReject: 5, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 6 },
        { service: 'अधिक्षमन नगरकर्ता दाखला देणे - To issue Fire NOC', applicationReceived: 45, approved: 13, authorisationReject: 10, authorisationPending: 0, paymentPending: 4, paymentReceived: 6, certificateIssued: 12 },
        { service: 'Fire NOC – Temporary Structures', applicationReceived: 1, approved: 0, authorisationReject: 1, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 0 },
      ],
      // Add other departments' services as needed – placeholder
      'Property Tax Department (বৈধত্ব বিলাম)': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Construction Department / পদ / খাদ্যশালা বিলাম (Pwd)': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Trade License': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Solid Waste Management Department (পদকাশনী মজুমদার বিলাম)': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Bombay Nursing Act': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Water Supply Department / পদশী বিলাম': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'NOC Department': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Birth And Death Department / জন্ম-নমূণ বিলাম': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Marriage Registration Dept.': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
      'Town Planning Department / পদশনী বিলাম': [{ service: 'Sample Service', applicationReceived: 10, approved: 5, authorisationReject: 1, authorisationPending: 0, paymentPending: 2, paymentReceived: 1, certificateIssued: 1 }],
    },
    // Placeholder for other corporations – you can add real data later
    Ichalkaranji: {},
    'Urun Ilampur': {},
    Kolhapur: {},
    Jalgaon: {},
    Dhule: {},
    Parbhani: {},
    'Bhivandi Nizampur': {},
    Malegaon: {},
    Latur: {},
    Sangli: {},
  };

  // ─── State ──────────────────────────────────────────────────────────────
  const [view, setView] = useState('summary'); // 'summary', 'departments', 'services'
  const [selectedCorporation, setSelectedCorporation] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // ─── Toast state ──────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleCellClick = (corporation, columnKey, value) => {
    const label = colLabels[columnKey] || columnKey;
    setToastMessage(`${corporation} · ${label}: ${value.toLocaleString()}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCorporationClick = (corpName) => {
    setSelectedCorporation(corpName);
    setView('departments');
  };

  const handleDepartmentClick = (deptName) => {
    setSelectedDepartment(deptName);
    setView('services');
  };

  const handleBackToSummary = () => {
    setView('summary');
    setSelectedCorporation(null);
    setSelectedDepartment(null);
  };

  const handleBackToDepartments = () => {
    setView('departments');
    setSelectedDepartment(null);
  };

  const formatNumber = (num) => num.toLocaleString();

  // ─── Helpers to compute totals ─────────────────────────────────────────
  const computeDeptTotals = (depts) => {
    const totals = { applicationReceived: 0, approved: 0, authorisationReject: 0, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 0 };
    depts.forEach(d => {
      totals.applicationReceived += d.applicationReceived;
      totals.approved += d.approved;
      totals.authorisationReject += d.authorisationReject;
      totals.authorisationPending += d.authorisationPending;
      totals.paymentPending += d.paymentPending;
      totals.paymentReceived += d.paymentReceived;
      totals.certificateIssued += d.certificateIssued;
    });
    return totals;
  };

  const computeServiceTotals = (services) => {
    const totals = { applicationReceived: 0, approved: 0, authorisationReject: 0, authorisationPending: 0, paymentPending: 0, paymentReceived: 0, certificateIssued: 0 };
    services.forEach(s => {
      totals.applicationReceived += s.applicationReceived;
      totals.approved += s.approved;
      totals.authorisationReject += s.authorisationReject;
      totals.authorisationPending += s.authorisationPending;
      totals.paymentPending += s.paymentPending;
      totals.paymentReceived += s.paymentReceived;
      totals.certificateIssued += s.certificateIssued;
    });
    return totals;
  };

  // ─── Render ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Failed to load dashboard data: {error}
      </div>
    );
  }

  // ─── Determine title and back button ──────────────────────────────────
  let title = 'RTS Dashboard';
  let backButton = null;

  if (view === 'departments') {
    title = `${selectedCorporation} – Department-wise Breakdown`;
    backButton = (
      <button className="btn btn-sm btn-outline-primary ms-auto" onClick={handleBackToSummary}>
        <i className="bi bi-arrow-left me-1"></i> Back to Summary
      </button>
    );
  } else if (view === 'services') {
    title = `${selectedCorporation} → ${selectedDepartment} – Service-wise Breakdown`;
    backButton = (
      <button className="btn btn-sm btn-outline-primary ms-auto" onClick={handleBackToDepartments}>
        <i className="bi bi-arrow-left me-1"></i> Back to Departments
      </button>
    );
  }

  return (
    <>
      <div className="dma-card">
        <div className="dma-card-header">
          <div className="dma-card-icon" style={{ background: 'var(--dma-navy)' }}>
            <i className="bi bi-table" style={{ color: '#fff' }}></i>
          </div>
          <h5 className="dma-card-title">{title}</h5>
          {backButton}
        </div>

        <div className="dma-card-body">
          <div className="dma-table-scroll">
            {view === 'summary' && (
              // ─── SUMMARY TABLE ──────────────────────────────────────────
              <div
                className="dma-table-scroll"
                style={{
                  maxHeight: hasMoreThanMax ? "400px" : "auto",
                  overflowY: hasMoreThanMax ? "auto" : "visible",
                }}
              >
                <table className="dma-table table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>Sr. No.</th>
                      <th className="text-center">Corporation</th>
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
                    {rowsData.map((row, index) => (
                      <tr key={row.corporation}>
                        <td className="text-center">{index + 1}</td>
                        <td className='text-center'>
                          <button
                            className="btn btn-link p-0 fw-bold text-decoration-underline"
                            style={{ color: 'var(--dma-blue)' }}
                            onClick={() => handleCorporationClick(row.corporation)}
                          >
                            {row.corporation}
                            <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                          </button>
                        </td>
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
                      <td className="text-center"></td>
                      <td className="text-center">{totals.corporation}</td>
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
            )}

            {view === 'departments' && (
              // ─── DEPARTMENT TABLE ──────────────────────────────────────
              selectedCorporation && departmentData[selectedCorporation] ? (
                <table className="dma-table table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Sr. No.</th>
                      <th>Department</th>
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
                    {departmentData[selectedCorporation].map((dept, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <button
                            className="btn btn-link p-0 fw-bold text-decoration-underline"
                            style={{ color: 'var(--dma-blue)' }}
                            onClick={() => handleDepartmentClick(dept.department)}
                          >
                            {dept.department}
                            <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                          </button>
                        </td>
                        {colKeys.map((key) => (
                          <td key={key} className="text-center">
                            {formatNumber(dept[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="text-center">—</td>
                      <td><strong>Total</strong></td>
                      {(() => {
                        const deptTotals = computeDeptTotals(departmentData[selectedCorporation]);
                        return colKeys.map(key => (
                          <td key={key} className="text-center"><strong>{formatNumber(deptTotals[key])}</strong></td>
                        ));
                      })()}
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="text-muted">No department data available for {selectedCorporation}.</p>
              )
            )}

            {view === 'services' && (
              // ─── SERVICE TABLE ─────────────────────────────────────────
              selectedCorporation && selectedDepartment && serviceData[selectedCorporation]?.[selectedDepartment] ? (
                <table className="dma-table table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Sr. No.</th>
                      <th>Service</th>
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
                    {serviceData[selectedCorporation][selectedDepartment].map((svc, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>{svc.service}</td>
                        {colKeys.map((key) => (
                          <td key={key} className="text-center">
                            {formatNumber(svc[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="text-center">—</td>
                      <td><strong>Total</strong></td>
                      {(() => {
                        const svcTotals = computeServiceTotals(serviceData[selectedCorporation][selectedDepartment]);
                        return colKeys.map(key => (
                          <td key={key} className="text-center"><strong>{formatNumber(svcTotals[key])}</strong></td>
                        ));
                      })()}
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="text-muted">No service data available for {selectedDepartment}.</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* ─── Toast ────────────────────────────────────────────────────── */}
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
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;