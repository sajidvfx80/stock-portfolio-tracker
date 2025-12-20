import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDateForChart } from '../utils/dateFormat';

const ProfitLossChart = ({ dailyStats }) => {
  if (dailyStats.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available for chart
      </div>
    );
  }

  const chartData = dailyStats.map(day => ({
    date: formatDateForChart(day.date),
    profit: day.profit,
    loss: day.loss,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
          labelStyle={{ color: '#374151' }}
        />
        <Legend />
        <Bar dataKey="profit" fill="#10b981" name="Profit" />
        <Bar dataKey="loss" fill="#ef4444" name="Loss" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitLossChart;

