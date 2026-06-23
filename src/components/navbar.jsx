import React from "react";
// import logo from "../assets/logo.png"; // your static logo

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 shadow-xl w-full">
      <div className="w-full flex h-[94px]">

        {/* LEFT LOGO */}
        <div
          className="flex items-center justify-center border border-[#054b65]"
          style={{ background: "white", width: "10%" }}
        >
          <img
            // src={logo}
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* CENTER TITLE */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ background: "#054b65" }}
        >
          <h1
            className="text-white font-bold text-center"
            style={{
              fontSize: "calc(1.325rem + .9vw)",
              lineHeight: 1.2,
            }}
          >
            Dashboard
          </h1>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="flex items-center justify-center border border-[#054b65]"
          style={{
            background: "white",
            width: "10%",
          }}
        >
          <span
            style={{
              color: "#054b65",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            DMA
          </span>
        </div>
      </div>
    </nav>
  );
}