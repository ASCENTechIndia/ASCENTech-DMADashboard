import { useEffect, useState } from "react";
import axios from "axios";
import { useEChart } from "../hooks/useEChart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function CollectionStatusDonutChart() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
   const [error, setError] = useState("");

  useEffect(() => {
    fetchModewiseCollection();
  }, []);

  const fetchModewiseCollection = async () => {
    try {
      setError("");
      const res = await axios.get(
        `${API_BASE_URL}/property/getModewiseCollection`
      );

      const row = res.data.data;

      const chartData = [
        {
          mode: "Online",
          amount: Number(row.ONLINE_AMOUNT || 0),
          color: "blue",
        },
        {
          mode: "Offline",
          amount: Number(row.OFFLINE_AMOUNT || 0),
          color: "orange",
        },
        {
          mode: "Cash",
          amount: Number(row.CASH_AMOUNT || 0),
          color: "red",
        },
      ];

      const totalCollection =
        Number(row.ONLINE_AMOUNT || 0) +
        Number(row.OFFLINE_AMOUNT || 0) +
        Number(row.CASH_AMOUNT || 0);

      setData(chartData);
      setTotal(totalCollection);
    } catch (err) {
      console.error("Modewise Collection Error:", err);
        setError(
    err?.response?.data?.message ||
    err?.message ||
    "Failed to load data"
  );
    }
  };

  const ref = useEChart(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "80%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "inside",
            formatter: "{d}%",
            color: "#ffffff",
            fontWeight: 700,
          },
          labelLine: { show: true },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 3,
          },
          data: data.map((d) => ({
            value: d.amount,
            name: d.mode,
            itemStyle: {
              color: COLOR_MAP[d.color],
            },
          })),
        },
      ],
      graphic: {
        elements: [
          {
            type: "text",
            left: "center",
            top: "42%",
            style: {
              text: "Total Collection",
              fontSize: 11,
              fill: "#64748b",
              fontWeight: 600,
            },
          },
          {
            type: "text",
            left: "center",
            top: "52%",
            style: {
              text: `${total.toFixed(2)}`,
              fontSize: 15,
              fill: "#1e2939",
              fontWeight: 800,
            },
          },
        ],
      },
    }),
    [data, total]
  );
if (error) {
  return (
    <div
      style={{
        width: "100%",
        height: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#dc2626",
      }}
    >
      {error}
    </div>
  );
}

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: 260,
      }}
    />
  );
}

export default CollectionStatusDonutChart;