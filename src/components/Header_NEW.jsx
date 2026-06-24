import { useState } from "react";

function Header_NEW({ title = "DMA Dashboard" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="rts-header">
      <div className="rts-header-left">
        <button
          className="rts-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
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
