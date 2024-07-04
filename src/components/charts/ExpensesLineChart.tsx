// src/components/Charts/ExpensesLineChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

interface ExpenseData {
  month: string;
  expenses: number;
  income: number;
}

interface ExpensesLineChartProps {
  data: ExpenseData[];
}

const ExpensesLineChart: React.FC<ExpensesLineChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400} minWidth={600}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="expenses" stroke="#ff7300" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="income" stroke="#387908" activeDot={{ r: 8 }} />
      <Brush dataKey="month" height={30} stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default ExpensesLineChart;