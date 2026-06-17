import { collectionRankingData } from "../data/dashboardData";

function CollectionRankingChart({ data = collectionRankingData }) {
  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="dma-bar-list">
      {data.map((row) => (
        <div className="dma-bar-row" key={row.corporation}>
          <span className="dma-bar-name">{row.corporation}</span>
          <div className="dma-bar-track">
            <div
              className="dma-bar-fill"
              style={{
                width: `${(row.amount / max) * 100}%`,
                background: "var(--dma-purple)",
              }}
            />
          </div>
          <span
            className="dma-bar-value"
            style={{ color: "var(--dma-purple)" }}
          >
            {row.amount.toFixed(2)} Cr
          </span>
        </div>
      ))}
    </div>
  );
}

export default CollectionRankingChart;
