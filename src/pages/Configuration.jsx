import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  normalizeServiceName,
  readServiceConfiguration,
  saveServiceConfiguration,
} from "../utils/serviceConfiguration";
import "../styles/Config.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Configuration() {
  const [corporations, setCorporations] = useState([]);
  const [selectedCorporationId, setSelectedCorporationId] = useState("");
  const [services, setServices] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [dashboardModules, setDashboardModules] = useState([]);
  const [isCorporationLoading, setIsCorporationLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isModulesLoading, setIsModulesLoading] = useState(false);
  const [error, setError] = useState("");
  const [modulesError, setModulesError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function fetchCorporations() {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/ULBList`);
        const list = response.data?.data;

        if (!Array.isArray(list)) {
          throw new Error("Corporation list response has an invalid format.");
        }

        if (isCurrent) setCorporations(list);
      } catch (requestError) {
        console.error("Corporation List Fetch Error:", requestError);
        if (isCurrent) {
          setError("Unable to load the corporation list.");
        }
      } finally {
        if (isCurrent) setIsCorporationLoading(false);
      }
    }

    fetchCorporations();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCorporationId) {
      return undefined;
    }

    let isCurrent = true;

    async function fetchServices() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/dashboard/DashboardDataNew`,
          { params: { ulbId: selectedCorporationId } },
        );
        const list = response.data?.data;

        if (!Array.isArray(list)) {
          throw new Error("Service list response has an invalid format.");
        }

        const availableServices = list.filter(
          (service) =>
            typeof service?.title === "string" &&
            normalizeServiceName(service.title) !== "",
        );
        const availableServiceNames = new Set(
          availableServices.map((service) => normalizeServiceName(service.title)),
        );
        const configuration = readServiceConfiguration();
        const savedServices = configuration[selectedCorporationId];
        const nextActiveServices =
          Array.isArray(savedServices) && savedServices.length > 0
            ? [
                ...new Set(
                  savedServices
                    .filter((name) => typeof name === "string")
                    .map(normalizeServiceName)
                    .filter((name) => availableServiceNames.has(name)),
                ),
              ]
            : [...availableServiceNames];

        if (!isCurrent) return;
        setServices(availableServices);
        setActiveServices(nextActiveServices);
      } catch (requestError) {
        console.error("Service List Fetch Error:", requestError);
        if (isCurrent) {
          setError("Unable to load services for this corporation.");
        }
      } finally {
        if (isCurrent) setIsServicesLoading(false);
      }
    }

    fetchServices();
    return () => {
      isCurrent = false;
    };
  }, [selectedCorporationId]);

  useEffect(() => {
    if (!selectedCorporationId) {
      return undefined;
    }

    let isCurrent = true;

    async function fetchDashboardModules() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/configurations/dashboardModules`,
          { params: { ulbId: selectedCorporationId } },
        );
        const list = response.data?.data;

        if (!Array.isArray(list)) {
          throw new Error("Dashboard module response has an invalid format.");
        }

        if (isCurrent) setDashboardModules(list);
      } catch (requestError) {
        console.error("Dashboard Module Configuration Fetch Error:", requestError);
        if (isCurrent) {
          setDashboardModules([]);
          setModulesError("Unable to load dashboard module configuration.");
        }
      } finally {
        if (isCurrent) setIsModulesLoading(false);
      }
    }

    fetchDashboardModules();
    return () => {
      isCurrent = false;
    };
  }, [selectedCorporationId]);

  const toggleService = (serviceName) => {
    const normalizedName = normalizeServiceName(serviceName);
    const nextActiveServices = activeServices.includes(normalizedName)
      ? activeServices.filter((name) => name !== normalizedName)
      : [...activeServices, normalizedName];

    try {
      const configuration = readServiceConfiguration();
      configuration[selectedCorporationId] = nextActiveServices;
      saveServiceConfiguration(configuration);
      setActiveServices(nextActiveServices);
      setSaveError("");
    } catch (storageError) {
      console.error("Service Configuration Save Error:", storageError);
      setSaveError("Unable to save service changes in this browser.");
    }
  };

  const selectedCorporation = corporations.find(
    (corporation) => String(corporation.CORPID) === selectedCorporationId,
  );

  return (
    <main className="config-page">
      <header className="config-header">
        <div className="config-header-brand">
          <img
            src="/Images/AscenTech_Logomini.png"
            alt="AscenTech"
            className="config-header-logo"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <div>
            <p className="config-eyebrow">DMA Dashboard</p>
            <h1>Service Configuration</h1>
          </div>
        </div>
        <Link className="config-dashboard-link" to="/">
          <span aria-hidden="true">←</span>
          Dashboard
        </Link>
      </header>

      <div className="config-content">
        <section className="config-intro">
          <span className="config-intro-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <div>
            <h2>Manage dashboard services</h2>
            <p>Choose a corporation, then switch the services shown on its dashboard on or off.</p>
          </div>
        </section>

        <section className="config-panel" aria-labelledby="config-panel-title">
          <div className="config-panel-heading">
            <div>
              <span className="config-section-kicker">CONFIGURATION</span>
              <h2 id="config-panel-title">Corporation services</h2>
            </div>
            {selectedCorporation && (
              <span className="config-active-count">
                <span className="config-active-dot" />
                {activeServices.length} of {services.length} active
              </span>
            )}
          </div>

          <div className="config-corporation-field">
            <label className="config-field-label" htmlFor="config-corporation">
              Corporation
            </label>
            <select
              className="config-select"
              id="config-corporation"
              value={selectedCorporationId}
              disabled={isCorporationLoading}
              onChange={(event) => {
                const corporationId = event.target.value;
                setSelectedCorporationId(corporationId);
                setServices([]);
                setActiveServices([]);
                setDashboardModules([]);
                setIsServicesLoading(Boolean(corporationId));
                setIsModulesLoading(Boolean(corporationId));
                setError("");
                setModulesError("");
                setSaveError("");
              }}
            >
              <option value="">
                {isCorporationLoading ? "Loading corporations..." : "Select a corporation"}
              </option>
              {corporations.map((corporation) => (
                <option key={corporation.CORPID} value={String(corporation.CORPID)}>
                  {corporation.ENGNAME || corporation.MARNAME}
                </option>
              ))}
            </select>
          </div>

          {selectedCorporation && (
            <div className="config-selected-corporation">
              <span className="config-corporation-avatar" aria-hidden="true">
                {(selectedCorporation.ENGNAME || selectedCorporation.MARNAME || "C")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>
              <div>
                <span className="config-corporation-label">Selected corporation</span>
                <strong>{selectedCorporation.ENGNAME || selectedCorporation.MARNAME}</strong>
              </div>
            </div>
          )}

          {error && (
            <p className="config-message config-message--error" role="alert">
              {error}
            </p>
          )}
          {saveError && (
            <p className="config-message config-message--error" role="alert">
              {saveError}
            </p>
          )}

          {isServicesLoading && (
            <p className="config-message" role="status">Loading services...</p>
          )}
          {!isCorporationLoading && corporations.length === 0 && !error && (
            <p className="config-message">No corporations are available.</p>
          )}
          {selectedCorporation && !isServicesLoading && !error && services.length === 0 && (
            <p className="config-message">No services are available for this corporation.</p>
          )}
          {services.length > 0 && (
            <div className="config-service-list" aria-label="Available services">
              {services.map((service, index) => {
                const serviceName = normalizeServiceName(service.title);
                const isActive = activeServices.includes(serviceName);

                return (
                  <label
                    className={`config-service-item${isActive ? " is-active" : ""}`}
                    key={`${serviceName}-${index}`}
                  >
                    <span className="config-service-copy">
                      <span className="config-service-name">{service.title}</span>
                      <span className={`config-service-status${isActive ? " is-active" : ""}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleService(service.title)}
                      aria-label={`${isActive ? "Deactivate" : "Activate"} ${service.title}`}
                    />
                    <span className="config-toggle" aria-hidden="true" />
                  </label>
                );
              })}
            </div>
          )}
        </section>

        {selectedCorporation && (
          <section className="config-panel config-modules-panel" aria-labelledby="config-modules-title">
            <div className="config-panel-heading">
              <div>
                <span className="config-section-kicker">API CONFIGURATION</span>
                <h2 id="config-modules-title">Dashboard modules</h2>
              </div>
              {!isModulesLoading && !modulesError && (
                <span className="config-active-count">
                  {dashboardModules.length} modules
                </span>
              )}
            </div>

            {isModulesLoading && (
              <p className="config-message" role="status">Loading dashboard modules...</p>
            )}
            {modulesError && (
              <p className="config-message config-message--error" role="alert">
                {modulesError}
              </p>
            )}
            {!isModulesLoading && !modulesError && dashboardModules.length === 0 && (
              <p className="config-message">No dashboard modules are configured for this corporation.</p>
            )}
            {dashboardModules.length > 0 && !modulesError && (
              <div className="config-modules-table-wrap">
                <table className="config-modules-table">
                  <thead>
                    <tr>
                      <th scope="col">Module title</th>
                      <th scope="col">Active</th>
                      <th scope="col">Display order</th>
                      <th scope="col">Clickable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardModules.map((module, index) => (
                      <tr key={module.VAR_MODULE_CODE || `${module.VAR_MODULE_TITLE}-${index}`}>
                        <td>{module.VAR_MODULE_TITLE || module.VAR_MODULE_CODE || "—"}</td>
                        <td>{module.CHR_ACTIVE ?? "—"}</td>
                        <td>{module.NUM_MODULE_ORDERBY ?? "—"}</td>
                        <td>{module.VAR_MODULE_CLICKABLE ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}