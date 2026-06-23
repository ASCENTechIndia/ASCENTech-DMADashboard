import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import HomeCards from "../components/HomeCards";
import Header from "../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/dashboard/DashboardDataNew`
      );
      console.log("API_BASE_URL", API_BASE_URL);
console.log("URL", `${API_BASE_URL}/dashboard/DashboardDataNew`);

      setCards(res.data.data || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  return (
    <>
      <div className="dma-dashboard">
      <Header />
      <div className="container-fluid px-4 py-4">
        <HomeCards cards={cards} />
      </div>
      </div>
    </>
  );
}

