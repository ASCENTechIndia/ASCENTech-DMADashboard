function Header({
  title = "DMA Dashboard",
  orgName = "Municipal Corporation",
  brandName = "Nagar Karyawali",
}) {
  return (
    <header className="dma-header">
      <div className="dma-header-logo">
        <span className="dma-header-logo-mark">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 4 8v3h16V8l-8-5Z" fill="#fff" />
            <rect x="6" y="12" width="3" height="8" fill="#fff" />
            <rect x="10.5" y="12" width="3" height="8" fill="#fff" />
            <rect x="15" y="12" width="3" height="8" fill="#fff" />
          </svg>
        </span>
        <div className="text-start">
          <span className="dma-header-org-name">{orgName}</span>
          <span className="dma-header-org-name-title d-lg-none d-block">
            {title}
          </span>
        </div>
      </div>

      <h1 className="dma-header-title">{title}</h1>

      <div className="dma-header-brand">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="4" height="12" fill="var(--dma-navy)" />
          <rect x="9" y="5" width="4" height="16" fill="var(--dma-navy)" />
          <rect x="15" y="11" width="4" height="10" fill="var(--dma-navy)" />
        </svg>
        <span className="dma-header-brand-text">{brandName}</span>
      </div>
    </header>
  );
}

export default Header;
