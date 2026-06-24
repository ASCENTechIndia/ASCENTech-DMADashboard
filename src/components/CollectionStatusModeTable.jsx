import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function CollectionStatusModeTable({
  maxRowsBeforeScroll = 5,
}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState({
    amount: 0,
    percent: 100,
  });

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

    const tableData = [
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

    const totalAmount =
      Number(row.ONLINE_AMOUNT || 0) +
      Number(row.OFFLINE_AMOUNT || 0) +
      Number(row.CASH_AMOUNT || 0);

    setData(tableData);

    setTotal({
      amount: totalAmount,
      percent: 100,
    });
  } catch (err) {
    console.error("Modewise Collection Error:", err);

    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load data"
    );

    setData([]);
    setTotal({
      amount: 0,
      percent: 0,
    });
  }
};

  const hasMoreThanMax = data.length > maxRowsBeforeScroll;

  return (
    <div
      style={{
        maxHeight: hasMoreThanMax ? "260px" : "auto",
        overflowY: hasMoreThanMax ? "auto" : "visible",
      }}
    >
      <table className="dma-table dma-table-scroll">
        <thead>
          <tr>
            <th>Mode</th>
            <th className="dma-text-center">
              Collection
            </th>
            <th className="dma-text-center">%</th>
          </tr>
        </thead>

    <tbody>
  {error ? (
    <tr>
      <td
        colSpan="3"
        className="text-center text-danger"
      >
        {error}
      </td>
    </tr>
  ) : (
    data.map((row) => (
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

        <td className="dma-text-center">
          {row.amount.toFixed(2)}
        </td>

        <td className="dma-text-center">
          {row.percent.toFixed(2)}%
        </td>
      </tr>
    ))
  )}
</tbody>
      {!error && (
  <tfoot>
    <tr>
      <td>
        <strong>Total</strong>
      </td>

      <td className="dma-text-center">
        <strong>
          {total.amount.toFixed(2)}
        </strong>
      </td>

      <td className="dma-text-center">
        <strong>100%</strong>
      </td>
    </tr>
  </tfoot>
)}
      </table>
    </div>
  );
}

export default CollectionStatusModeTable;