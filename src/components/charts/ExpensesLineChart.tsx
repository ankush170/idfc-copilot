// src/components/Charts/ExpensesLineChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseData {
  month: string;
  expenses: number;
}

interface ExpensesLineChartProps {
  data: ExpenseData[];
}

const ExpensesLineChart: React.FC<ExpensesLineChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300} minWidth={600}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" interval={0} angle={-45} textAnchor="end" height={60} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="expenses" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default ExpensesLineChart;