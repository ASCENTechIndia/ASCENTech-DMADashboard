import {
  collectionPercentData,
  collectionPercentTotal,
} from "../data/dashboardData";

/**
 * CollectionPercentTable
 * Table: Corporation | Demand (Cr) | Collection (Cr) | Outstanding (Cr) | % (with progress bar)
 */
function CollectionPercentTable({
  data = collectionPercentData,
  total = collectionPercentTotal,
  maxRowsBeforeScroll = 5,
}) {
  const hasMoreThanMax = data.length > maxRowsBeforeScroll;

  return (
    <div
      className="dma-table-scroll"
      style={{
        maxHeight: hasMoreThanMax ? "300px" : "auto",
        overflowY: hasMoreThanMax ? "auto" : "visible",
      }}
    >
      <table className="dma-table">
        <thead>
          <tr>
            <th>Corporation</th>
            <th className="dma-text-center">Demand (Cr)</th>
            <th className="dma-text-center">Collection (Cr)</th>
            <th className="dma-text-center">Outstanding (Cr)</th>
            <th className="dma-text-center">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.corporation}>
              <td>{row.corporation}</td>
              <td className="dma-text-center">{row.demand.toFixed(2)}</td>
              <td className="dma-text-center">{row.collection.toFixed(2)}</td>
              <td className="dma-text-center">{row.outstanding.toFixed(2)}</td>
              <td>
                <div className="dma-progress-cell">
                  <div className="dma-progress-track">
                    <div
                      className="dma-progress-fill"
                      style={{ width: `${Math.min(row.percent, 100)}%` }}
                    />
                  </div>
                  <span className="dma-progress-value">
                    {row.percent.toFixed(2)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td className="dma-text-center">{total.demand.toFixed(2)}</td>
            <td className="dma-text-center">{total.collection.toFixed(2)}</td>
            <td className="dma-text-center">{total.outstanding.toFixed(2)}</td>
            <td className="dma-text-center">{total.percent.toFixed(2)}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default CollectionPercentTable;
