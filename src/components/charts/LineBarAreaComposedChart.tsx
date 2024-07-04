// src/components/Charts/LineBarAreaComposedChart.tsx
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComposedData {
  name: string;
  income: number;
  expenses: number;
  savings: number;
}

interface LineBarAreaComposedChartProps {
  data: ComposedData[];
}

const LineBarAreaComposedChart: React.FC<LineBarAreaComposedChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400} minWidth={600}>
    <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="name" scale="band" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="income" fill="#8884d8" stroke="#8884d8" />
      <Bar dataKey="expenses" barSize={20} fill="#413ea0" />
      <Line type="monotone" dataKey="savings" stroke="#ff7300" />
    </ComposedChart>
  </ResponsiveContainer>
);

export default LineBarAreaComposedChart;