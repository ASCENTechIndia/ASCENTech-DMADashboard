import { useState, useEffect } from 'react';
import axios from 'axios';
import { useEChart } from '../hooks/useEChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  residential: '#2f6fed',
  commercial: '#f5891f',
  mixed: '#1fa854',
  border: 'rgba(148, 163, 184, 0.25)',
  muted: '#64748b',
};

/**
 * PropertyDistributionChart
 * Stacked bar chart: Residential / Commercial / Mixed counts per corporation.
 * Pairs with <PropertySummaryTable /> inside the "Property Summary" card.
 */
function PropertyDistributionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPropertySummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/property/getPropertySummary`);
        if (response.data.success) {
          const rows = response.data.data || [];
          if (rows.length === 0) {
            setMessage(response.data.message || 'No property data available.');
          } else {
            setData(
              rows.map((item) => ({
                corporation: item.CORPORATION || 'Unknown',
                residential: Number(item.RESIDENTIAL || 0),
                commercial: Number(item.COMMERCIAL || 0),
                mixed: Number(item.MIXED || 0),
              }))
            );
          }
        } else {
          setMessage(response.data.message || 'Failed to load property data.');
        }
      } catch (err) {
        console.error('Error fetching property summary for chart:', err);
        setMessage(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertySummary();
  }, []);

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
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="alert alert-info m-2" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        {message}
      </div>
    );
  }

  return <div className="echart-container" ref={ref} />;
}

export default PropertyDistributionChart;
