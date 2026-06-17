import { todaysCollectionData } from "../data/dashboardData";

function TodaysCollectionTable({
  data = todaysCollectionData,
  maxRowsBeforeScroll = 5,
}) {
  const rows = data.rows || [];
  const hasMoreThanMax = rows.length > maxRowsBeforeScroll;

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
            <th className="dma-text-center">Count</th>
            <th className="dma-text-center">Amount (L)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.corporation}>
              <td>{row.corporation}</td>
              <td className="dma-text-center">{row.count}</td>
              <td className="dma-text-center">{row.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td className="dma-text-center">{data.total.count}</td>
            <td className="dma-text-center">{data.total.amount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TodaysCollectionTable;
