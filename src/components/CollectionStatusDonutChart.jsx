import { useEChart } from "../hooks/useEChart";
import { collectionModeData, collectionModeTotal } from "../data/dashboardData";

const COLOR_MAP = {
  blue: "#2f6fed",
  orange: "#f5891f",
  red: "#e6453c",
};

function CollectionStatusDonutChart({
  data = collectionModeData,
  total = collectionModeTotal,
}) {
  const ref = useEChart(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}: {c} Cr ({d}%)" },
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
          itemStyle: { borderColor: "#fff", borderWidth: 3 },
          data: data.map((d) => ({
            value: d.amount,
            name: d.mode,
            itemStyle: { color: COLOR_MAP[d.color] },
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
              text: `${total.amount} Cr`,
              fontSize: 15,
              fill: "#1e2939",
              fontWeight: 800,
            },
          },
        ],
      },
    }),
    [data, total],
  );
  return <div ref={ref} style={{ width: "100%", height: 260 }} />;
}

export default CollectionStatusDonutChart;
