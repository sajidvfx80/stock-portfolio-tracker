import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDateForChart } from '../utils/dateFormat';

const ProfitLossChart = ({ dailyStats }) => {
  if (dailyStats.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available for chart
      </div>
    );
  }

  const chartData = dailyStats.map(day => ({
    date: formatDateForChart(day.date),
    profit: day.profit,
    loss: day.loss,
  }));

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#4b5563' : '#e5e7eb';

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: textColor }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: textColor }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
          labelStyle={{ color: textColor }}
          contentStyle={{ 
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${gridColor}`,
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[8, 8, 0, 0]} />
        <Bar dataKey="loss" fill="#ef4444" name="Loss" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitLossChart;

