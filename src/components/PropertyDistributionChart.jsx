import { useEChart } from '../hooks/useEChart'
import { propertySummaryData } from '../data/dashboardData'

const COLORS = {
  residential: '#2f6fed',
  commercial: '#f5891f',
  mixed: '#1fa854',
  border: 'rgba(148, 163, 184, 0.25)',
  muted: '#64748b',
}

/**
 * PropertyDistributionChart
 * Stacked bar chart: Residential / Commercial / Mixed counts per corporation.
 * Pairs with <PropertySummaryTable /> inside the "Property Summary" card.
 */
function PropertyDistributionChart({ data = propertySummaryData }) {
  const ref = useEChart(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        top: 0,
        data: ['Residential', 'Commercial', 'Mixed'],
        textStyle: { color: COLORS.muted },
      },
      grid: { left: '3%', right: '4%', bottom: '12%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.corporation),
        axisLine: { lineStyle: { color: COLORS.border } },
        axisLabel: { color: COLORS.muted, rotate: 35, fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: COLORS.border, type: 'dashed' } },
        axisLabel: { color: COLORS.muted, formatter: (v) => (v >= 1000 ? `${v / 1000}K` : v) },
      },
      series: [
        { name: 'Residential', type: 'bar', stack: 'total', data: data.map((d) => d.residential), itemStyle: { color: COLORS.residential } },
        { name: 'Commercial', type: 'bar', stack: 'total', data: data.map((d) => d.commercial), itemStyle: { color: COLORS.commercial } },
        { name: 'Mixed', type: 'bar', stack: 'total', data: data.map((d) => d.mixed), itemStyle: { color: COLORS.mixed } },
      ],
    }),
    [data]
  )

  return <div className="echart-container" ref={ref} />
}

export default PropertyDistributionChart
