// src/charts/LineChart.tsx
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Expenses Trend',
        data: data.values,
        fill: false,
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
