
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Navbar({ fetchDashboard, resolvedUlbID }) {
  const ULB_ID = resolvedUlbID;
  console.log("ULB", ULB_ID)
  // const ULB_ID = import.meta.env.VITE_ULB_ID;
  const [ulbID, setUlbID] = useState(null);
  const [textLogo, setTextLogo] = useState(null);
  const [municipalText, setMunicipalText] = useState(null);
  const refreshTime = 60; // ⬅ इथे Refresh Interval (seconds) बदलू शकतेस
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(refreshTime);
  const [corpLogo, setCorpLogo] = useState(null);


  // Fetch Logo + Label only from textlogo API
  // useEffect(() => {
  //   if (!ulbID) return;
  //   (async () => {
  //     try {

  //       const res = await axios.get(`${API_BASE_URL}/textlogo/${ulbID}`);

  //       const logo = res?.data?.data?.ULBLOGO || null;
  //       const mText = res?.data?.data?.ABC_MUNICIPAL_TEXT || null;

  //       // Validate and assign only if exists
  //       setTextLogo(logo?.startsWith("data:") ? logo : `data:image/png;base64,${logo}`);
  //       setMunicipalText(mText ?? "");
  //     } catch (err) {
  //       console.error("Fetch Error:", err);
  //       setTextLogo(null);
  //       setMunicipalText("");
  //     }
  //   })();
  // }, [ulbID]);

  useEffect(() => {
    if (!ULB_ID) return; // ✅ prevent undefined usage
    setUlbID(String(ULB_ID));
  }, [ULB_ID]);

  const fetchLogo = async (ulbID) => {
    if (!ulbID) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/CorporationLogo/${ulbID}`,
        { responseType: "blob" } // ✅ VERY IMPORTANT
      );
      console.log("object", res)
      const imageUrl = URL.createObjectURL(res.data); // ✅ convert to usable URL
      setCorpLogo(imageUrl);

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (ulbID) {
      fetchLogo(ulbID);
    }
  }, [ulbID]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchDashboard();   // 🔥 Only API refresh — NO page reload
          return refreshTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshTime, fetchDashboard]);



  return (
    <motion.nav className="sticky top-0 z-50 sm:h-[94px] backdrop-blur-md shadow-xl w-full">
      <div className="w-full flex h-full">

        {/* LEFT LOGO */}
        <div className="flex items-center justify-center px-4 border-3 border-[#054b65]"
          style={{ background: "white", width: "10%" }}>
          <img src={corpLogo} alt="ULB Logo" className="h-12 sm:h-18 w-24 object-center" />
        </div>

        {/* CENTER */}
        <div className="flex-1 flex items-center justify-center px-4 py-2" style={{ background: "#054b65" }}>
          <div className="text-white font-bold text-center"
            style={{ fontSize: "calc(1.325rem + .9vw)", lineHeight: 1.2 }}>
            Dashboard
          </div>
        </div>

        {/* RIGHT — TIMER SECTION */}
        <div
          className="
    flex flex-col items-center justify-start      
    border-3 border-[#054b65] font-semibold 
    h-full text-center bg-white
    w-[28%] sm:w-[22%] md:w-[16%] lg:w-[13%] xl:w-[11%]
    p-0 m-0 leading-none
  "
        >

          {/* TITLE - Minimal padding */}
          <h6
            className="
      text-[10px] sm:text-sm md:text-base lg:text-lg
      font-extrabold bg-gradient-to-r from-[#054b65] to-[#0788b9]
      text-transparent bg-clip-text mt-[2px]
    " style={{ color: "blue" }}
          >
            Refresh In
          </h6>

          {/* COUNTDOWN - Tight spacing */}
          <h4
            className="
      text-[18px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
      font-black text-red-600 mt-[1px]
    " style={{ color: "black" }}
          >
            {countdown}s
          </h4>

          {/* BUTTON Very Compact */}
          <button
            onClick={() => setAutoRefresh(prev => !prev)}
            className={`
      mt-0.5 py-1 rounded-md text-white 
      text-[5px] sm:text-xs md:text-sm font-semibold 
      transition-all duration-200 shadow-sm w-full
      ${autoRefresh ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
    `}
          >
            {autoRefresh ? "Stop Refreshing" : "Start Refreshing"}
          </button>
        </div>


      </div>
    </motion.nav>
  );

}
