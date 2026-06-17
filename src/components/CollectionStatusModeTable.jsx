import { collectionModeData, collectionModeTotal } from "../data/dashboardData";

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function CollectionStatusModeTable({
  data = collectionModeData,
  total = collectionModeTotal,
  maxRowsBeforeScroll = 5,
}) {
  const hasMoreThanMax = data.length > maxRowsBeforeScroll;

  return (
    <div
      className=""
      style={{
        maxHeight: hasMoreThanMax ? "260px" : "auto",
        overflowY: hasMoreThanMax ? "auto" : "visible",
      }}
    >
      <table className="dma-table dma-table-scroll">
        <thead>
          <tr>
            <th>Mode</th>
            <th className="dma-text-center">Collection (Cr)</th>
            <th className="dma-text-center">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.mode}>
              <td>
                <span
                  className="dma-legend-dot"
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: COLOR_MAP[row.color],
                    marginRight: 8,
                  }}
                />
                {row.mode}
              </td>
              <td className="dma-text-center">{row.amount.toFixed(2)}</td>
              <td className="dma-text-center">{row.percent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td className="dma-text-center">{total.amount.toFixed(2)}</td>
            <td className="dma-text-center">{total.percent}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default CollectionStatusModeTable;
