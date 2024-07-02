// src/components/Charts/InvestmentBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentData {
  quarter: string;
  FD: number;
  DirectEquity: number;
  MutualFunds: number;
  Insurance: number;
}

interface InvestmentBarChartProps {
  data: InvestmentData[];
}

const InvestmentBarChart: React.FC<InvestmentBarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400} minWidth={600}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="quarter" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="FD" stackId="a" fill="#8884d8" />
      <Bar dataKey="DirectEquity" stackId="a" fill="#82ca9d" />
      <Bar dataKey="MutualFunds" stackId="a" fill="#ffc658" />
      <Bar dataKey="Insurance" stackId="a" fill="#ff8042" />
    </BarChart>
  </ResponsiveContainer>
);

export default InvestmentBarChart;