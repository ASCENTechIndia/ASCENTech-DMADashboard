import { topPerformingData } from "../data/dashboardData";

function TopPerformingCorporationsChart({ data = topPerformingData }) {
  const max = Math.max(...data.map((d) => d.percent));

  return (
    <div className="dma-bar-list">
      {data.map((row) => (
        <div className="dma-bar-row" key={row.corporation}>
          <span className="dma-bar-name">{row.corporation}</span>
          <div className="dma-bar-track">
            <div
              className="dma-bar-fill"
              style={{
                width: `${(row.percent / max) * 100}%`,
                background: "var(--dma-green)",
              }}
            />
          </div>
          <span className="dma-bar-value" style={{ color: "var(--dma-green)" }}>
            {row.percent.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default TopPerformingCorporationsChart;
