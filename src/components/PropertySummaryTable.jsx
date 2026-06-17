import {
  propertySummaryData,
  propertySummaryTotal,
} from "../data/dashboardData";

function PropertySummaryTable({
  data = propertySummaryData,
  total = propertySummaryTotal,
}) {
  const hasMoreThanFive = data.length > 5;

  return (
    <div
      className="dma-table-scroll"
      style={{
        maxHeight: hasMoreThanFive ? "300px" : "auto",
        overflowY: hasMoreThanFive ? "auto" : "visible",
      }}
    >
      <table className="dma-table">
        <thead>
          <tr>
            <th>Corporation</th>
            <th className="dma-text-center">Residential</th>
            <th className="dma-text-center">Commercial</th>
            <th className="dma-text-center">Mixed</th>
            <th className="dma-text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.corporation}>
              <td>{row.corporation}</td>
              <td className="dma-text-center">
                {row.residential.toLocaleString("en-IN")}
              </td>
              <td className="dma-text-center">
                {row.commercial.toLocaleString("en-IN")}
              </td>
              <td className="dma-text-center">
                {row.mixed.toLocaleString("en-IN")}
              </td>
              <td className="dma-text-center">
                {row.total.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td className="dma-text-center">
              {total.residential.toLocaleString("en-IN")}
            </td>
            <td className="dma-text-center">
              {total.commercial.toLocaleString("en-IN")}
            </td>
            <td className="dma-text-center">
              {total.mixed.toLocaleString("en-IN")}
            </td>
            <td className="dma-text-center">
              {total.total.toLocaleString("en-IN")}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default PropertySummaryTable;