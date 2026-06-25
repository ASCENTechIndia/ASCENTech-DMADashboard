import { useNavigate } from "react-router-dom";

function Header_NEW({ title = "DMA Dashboard" }) {
  const navigate = useNavigate();

  return (
    <header className="rts-header">
      <div className="rts-header-left">
        <button
          className="rts-back-btn"
          onClick={() => {
            const event = new CustomEvent("rts-back-click", { cancelable: true });
            window.dispatchEvent(event);
            if (!event.defaultPrevented) {
              navigate("/");
            }
          }}
          aria-label="Go back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="rts-header-logo-wrap">
          <img
            src="/Images/AscenTech_Logomini.png"
            alt="AscenTech Logo"
            className="rts-header-logo"
          />
        </div>
      </div>

      <h1 className="rts-header-title">{title}</h1>

      <div className="rts-header-right">
        <img
          src="/Images/MasterPageLogo.png"
          alt="Nagar Karyawali Logo"
          className="rts-header-brand-logo"
        />
      </div>
    </header>
  );
}

export default Header_NEW;
