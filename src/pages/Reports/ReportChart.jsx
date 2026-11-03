import ColumnChart from '../../components/Charts/ColumnChart.jsx';
import LineChart from '../../components/Charts/LineChart.jsx';
import BarList from '../../components/Charts/BarList.jsx';
import StackedBar from '../../components/Charts/StackedBar.jsx';

// Draws a report's `chart` config (see reportDefinitions.js) with the matching chart.
export default function ReportChart({ chart }) {
  switch (chart.type) {
    case 'column':
      return <ColumnChart labels={chart.labels} series={chart.series} format={chart.format} />;
    case 'line':
      return <LineChart labels={chart.labels} series={chart.series} format={chart.format} />;
    case 'bars':
      return <BarList rows={chart.rows} format={chart.format} />;
    case 'stacked':
      return (
        <div className="py-6">
          <StackedBar parts={chart.parts} format={chart.format} />
        </div>
      );
    default:
      return null;
  }
}

// Legend entries for charts with 2+ series (single-series charts are named by their title).
export function legendFor(chart) {
  if (chart.series?.length > 1) {
    return chart.series.map((s) => ({ name: s.name, color: s.color, shape: chart.type === 'line' ? 'line' : 'box' }));
  }
  return [];
}
