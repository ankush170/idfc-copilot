// src/charts/BarChart.tsx
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Investments Trend',
        data: data.values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
