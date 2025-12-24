import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getBalanceHistory } from '../utils/calculations';
import { formatDateForChart } from '../utils/dateFormat';

const BalanceChart = ({ data }) => {
  const balanceHistory = getBalanceHistory(
    data.openingBalance,
    data.trades,
    data.cashFlows
  );

  const chartData = balanceHistory.map(point => ({
    date: formatDateForChart(point.date),
    balance: point.balance,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available for chart
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#4b5563' : '#e5e7eb';

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
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
          formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Balance']}
          labelStyle={{ color: textColor }}
          contentStyle={{ 
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${gridColor}`,
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ r: 4, fill: '#3b82f6' }}
          activeDot={{ r: 6, fill: '#2563eb' }}
          name="Balance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;

