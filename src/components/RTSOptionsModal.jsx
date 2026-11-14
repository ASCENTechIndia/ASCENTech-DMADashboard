
/* ── RTS Options Modal ──────────────────────────────────────────────── */
export default function RTSOptionsModal({
    onClose,
    onRTSDashboard,
    onRTSServices,
    rtsDashboardUrl
}) {
    // Close on overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="rts-modal-overlay" onClick={handleOverlayClick}>
            <div className="rts-modal">
                <button className="rts-modal-close" onClick={onClose} title="बंद करा">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="18" x2="18" y2="6" />
                    </svg>
                </button>

                <div className="rts-modal-icon">
                    <svg width="28" height="28" viewBox="-1 1.5 24 24" fill="none">
                        <rect x="2" y="7" width="13" height="15" rx="1.5"
                            stroke="currentColor" strokeWidth="1.7" />
                        <rect x="15" y="11" width="7" height="11" rx="1.5"
                            stroke="currentColor" strokeWidth="1.7" />
                        <rect x="5" y="10" width="2.5" height="2.5" rx="0.5"
                            fill="currentColor" opacity="0.7" />
                        <rect x="9.5" y="10" width="2.5" height="2.5" rx="0.5"
                            fill="currentColor" opacity="0.7" />
                        <rect x="5" y="14.5" width="2.5" height="2.5" rx="0.5"
                            fill="currentColor" opacity="0.7" />
                        <rect x="9.5" y="14.5" width="2.5" height="2.5" rx="0.5"
                            fill="currentColor" opacity="0.7" />
                        <rect x="17" y="14" width="2" height="2" rx="0.4"
                            fill="currentColor" opacity="0.7" />
                        <rect x="17" y="18" width="2" height="2" rx="0.4"
                            fill="currentColor" opacity="0.7" />
                        <rect x="7" y="19" width="3" height="3" rx="0.5"
                            fill="currentColor" opacity="0.6" />
                    </svg>
                </div>

                <h2 className="rts-modal-title">RTS विभाग</h2>
                <p className="rts-modal-sub">
                    खाली दिलेल्या पर्यायांपैकी एक निवडा
                </p>

                <div className="rts-modal-divider" />

                <div className="rts-modal-btns">
                    {/* RTS Dashboard */}
                    <button
                        className="rts-modal-btn--primary"
                        onClick={onRTSDashboard}
                    >
                        <div className="rts-modal-btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                        </div>

                        <div className="rts-modal-btn-text">
                            <span className="rts-modal-btn-label">RTS Dashboard</span>
                            <span className="rts-modal-btn-desc">
                                {rtsDashboardUrl}
                            </span>
                        </div>

                        <svg className="rts-modal-btn-arrow" width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>

                    {/* RTS Services Wise Pendancy */}
                    <button
                        className="rts-modal-btn--secondary"
                        onClick={onRTSServices}
                    >
                        <div className="rts-modal-btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"
                                    stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>

                        <div className="rts-modal-btn-text">
                            <span className="rts-modal-btn-label">
                                RTS Services Wise Pendancy
                            </span>
                            <span className="rts-modal-btn-desc">
                                विभाग व सेवानिहाय प्रलंबित अर्ज पहा
                            </span>
                        </div>

                        <svg className="rts-modal-btn-arrow" width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
