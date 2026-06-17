import { useEChart } from "../hooks/useEChart";
import { paymentModeAnalysisData } from "../data/dashboardData";

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function PaymentModeAnalysisChart({ data = paymentModeAnalysisData }) {
  const ref = useEChart(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}: {c} Cr ({d}%)" },
      series: [
        {
          type: "pie",
          radius: ["30%", "80%"],
          center: ["50%", "50%"],
          label: { show: false },
          itemStyle: { borderColor: "#fff", borderWidth: 3 },
          data: data.map((d) => ({
            value: d.amount,
            name: d.mode,
            itemStyle: { color: COLOR_MAP[d.color] },
          })),
        },
      ],
    }),
    [data],
  );

  return (
    <div className="dma-card-body--split">
      <div
        className="dma-payment-donut-chart"
        ref={ref}
        style={{ height: "200px", width: "100%" }}
      />
      <div className="dma-legend-list">
        {data.map((row) => (
          <div className="dma-legend-item" key={row.mode}>
            <span
              className="dma-legend-dot"
              style={{ background: COLOR_MAP[row.color] }}
            />
            <div>
              <div className="dma-legend-label">{row.mode}</div>
              <div className="dma-legend-sub">
                {row.amount.toFixed(2)} Cr ({row.percent.toFixed(2)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentModeAnalysisChart;
