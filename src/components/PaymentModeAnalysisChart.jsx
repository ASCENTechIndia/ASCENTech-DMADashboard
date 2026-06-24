import { useEffect, useState } from "react";
import axios from "axios";
import { useEChart } from "../hooks/useEChart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function PaymentModeAnalysisChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchModewiseCollection();
  }, []);

  const fetchModewiseCollection = async () => {
    try {
      setError("")
      const res = await axios.get(
        `${API_BASE_URL}/property/getModewiseCollection`
      );

      const row = res.data.data;

      const chartData = [
        {
          mode: "Online",
          amount: Number(row.ONLINE_AMOUNT || 0),
          percent: Number(row.ONLINE_PERCENTAGE || 0),
          color: "blue",
        },
        {
          mode: "Offline",
          amount: Number(row.OFFLINE_AMOUNT || 0),
          percent: Number(row.OFFLINE_PERCENTAGE || 0),
          color: "orange",
        },
        {
          mode: "Cash",
          amount: Number(row.CASH_AMOUNT || 0),
          percent: Number(row.CASH_PERCENTAGE || 0),
          color: "red",
        },
      ];

      setData(chartData);
    } catch (err) {
  console.error("Modewise Collection Error:", err);

  setError(
    err?.response?.data?.message ||
    err?.message ||
    "Failed to load data"
  );

  setData([]);
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
          radius: ["30%", "80%"],
          center: ["50%", "50%"],
          label: { show: false },
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
    }),
    [data]
  );
if (error) {
  return (
    <div
      style={{
        height: "220px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "red",
      }}
    >
      {error}
    </div>
  );
}
  return (
    <div className="dma-card-body--split">
      <div
        className="dma-payment-donut-chart"
        ref={ref}
        style={{ height: "220px", width: "100%" }}
      />

      <div className="dma-legend-list">
        {data.map((row) => (
          <div
            className="dma-legend-item"
            key={row.mode}
          >
            <span
              className="dma-legend-dot"
              style={{
                background: COLOR_MAP[row.color],
              }}
            />

            <div>
              <div className="dma-legend-label">
                {row.mode}
              </div>

              <div className="dma-legend-sub">
                {row.amount.toFixed(2)}
                {" "}
                ({row.percent.toFixed(2)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentModeAnalysisChart;