// Reusable component that displays a row of 8 external portal quick cards.
// Each card has a centered logo (SVG or image) and a label below it.
// Clicking redirects to the URL in a new tab.

import React from "react";

// Default external links based on user request
const DEFAULT_LINKS = [
  {
    name: "E - Office",
    url: "https://parichay.nic.in/pnv1/assets/login?sid=1234567899",
    color: "blue",
    image: "/Images/e-Office.png",
  },
  {
    name: "Shasan Nirnay",
    url: "https://gr.maharashtra.gov.in/1145/Government-Resolutions",
    color: "orange",
    image: "/Images/State-Emblem-of-India.png",
  },
  {
    name: "Rediffmail",
    url: "https://mail.rediff.com/cgi-bin/login.cgi",
    color: "red",
    image: "/Images/emaillogo.jpg",
  },
  {
    name: "Dhule Corporation Website",
    url: "https://dhulecorporation.org/",
    color: "teal",
    image: "/Images/website.png",
  },
  {
    name: "Gmail",
    url: "http://mail.google.com/",
    color: "pink",
    image: "/Images/Gmail.png",
  },
  {
    name: "Aaple Sarkar",
    url: "https://grievances.maharashtra.gov.in/admin/mr/users/login",
    color: "gold",
    image: "/Images/aaple-sarkar-seeklogo.jpg",
  },
  {
    name: "eHRMS",
    url: "https://ehrms.dhulecorporation.in/admin/super-admin/login#/admin/commissioner",
    color: "indigo",
    image: "/Images/eHRMS.jpg",
  },
  {
    name: "HOD",
    url: "https://pathvikreta.dhulecorporation.in/hod",
    color: "purple",
    image: "/Images/HOD-icon.png",
  },
];

export function QuickLinkCard({ name, url, color = "blue", icon, image }) {
  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`hn-quick-card hn-quick-card--${color}`} onClick={handleClick}>
      <div className={`hn-quick-card-icon-wrap hn-icon-bg-${color}`}>
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className={`hn-quick-card-img${["aaple sarkar", "ehrms", "hod"].includes(name.toLowerCase()) ? " hn-quick-card-img--large" : ""}`} 
          />
        ) : (
          <span className="hn-quick-card-icon">{icon}</span>
        )}
      </div>
      <span className="hn-quick-card-name">{name}</span>
      <span className="hn-quick-card-action">Visit Portal ↗</span>
    </div>
  );
}

export default function QuickLinkCards({ links = DEFAULT_LINKS }) {
  return (
    <div className="hn-quick-links-section">
      {/* <h2 className="hn-section-title hn-quick-links-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        External Portals & Quick Links
      </h2> */}
      <div className="hn-quick-links-grid">
        {links.map((link, idx) => (
          <QuickLinkCard
            key={idx}
            name={link.name}
            url={link.url}
            color={link.color}
            icon={link.icon}
            image={link.image}
          />
        ))}
      </div>
    </div>
  );
}
