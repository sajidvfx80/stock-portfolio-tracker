import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import {
  calculateBalance,
  calculateTotalProfitLoss,
  calculateTotalCashFlow,
  calculateROI,
} from '../utils/calculations';
import {
  getProfitLossByTradeType,
  getTradeCountByType,
} from '../utils/tradeTypeAnalytics';
import { formatDateDDMMYY } from '../utils/dateFormat';
import BalanceChart from './BalanceChart';
import AnimatedCounter from './AnimatedCounter';

const Dashboard = ({ data, updateOpeningBalance }) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState(data.openingBalance);

  const currentBalance = calculateBalance(
    data.openingBalance,
    data.trades,
    data.cashFlows
  );
  const totalProfitLoss = calculateTotalProfitLoss(data.trades);
  const totalCashFlow = calculateTotalCashFlow(data.cashFlows);
  const roi = calculateROI(data.openingBalance, totalProfitLoss, totalCashFlow);
  
  // Trade type profit/loss breakdown
  const profitLossByType = getProfitLossByTradeType(data.trades);
  const tradeCountByType = getTradeCountByType(data.trades);

  const handleBalanceUpdate = () => {
    updateOpeningBalance(parseFloat(newBalance) || 0);
    setIsEditingBalance(false);
  };

  const stats = [
    {
      label: 'Current Balance',
      value: currentBalance,
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'stat-card-gradient-blue',
      prefix: '₹',
      decimals: 2,
    },
    {
      label: 'Total Profit/Loss',
      value: totalProfitLoss,
      icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalProfitLoss >= 0 ? 'text-profit' : 'text-loss',
      gradient: totalProfitLoss >= 0 ? 'stat-card-gradient-green' : 'stat-card-gradient-red',
      prefix: totalProfitLoss >= 0 ? '+₹' : '₹',
      decimals: 2,
    },
    {
      label: 'ROI',
      value: parseFloat(roi),
      icon: Activity,
      color: parseFloat(roi) >= 0 ? 'text-profit' : 'text-loss',
      gradient: parseFloat(roi) >= 0 ? 'stat-card-gradient-green' : 'stat-card-gradient-red',
      suffix: '%',
      decimals: 2,
    },
    {
      label: 'Total Cash Flow',
      value: totalCashFlow,
      icon: DollarSign,
      color: 'text-gray-600 dark:text-gray-400',
      gradient: 'stat-card-gradient-purple',
      prefix: '₹',
      decimals: 2,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Opening Balance</h2>
          {!isEditingBalance ? (
            <button
              onClick={() => setIsEditingBalance(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleBalanceUpdate}
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingBalance(false);
                  setNewBalance(data.openingBalance);
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {isEditingBalance ? (
          <input
            type="number"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            className="input-enhanced"
            placeholder="Enter opening balance"
          />
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
            <AnimatedCounter value={data.openingBalance} prefix="₹" decimals={2} />
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.gradient} rounded-xl shadow-lg p-6 card-hover animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-2 tabular-nums`}>
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix || ''} 
                      suffix={stat.suffix || ''}
                      decimals={stat.decimals || 0}
                    />
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color} flex-shrink-0`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profit/Loss by Trade Type</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Quick overview of which trade type is profitable or losing</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Stocks', 'Commodity', 'Options'].map((type) => {
            const stats = profitLossByType[type] || { profit: 0, loss: 0, net: 0, trades: 0 };
            const count = tradeCountByType[type] || 0;
            const isProfit = stats.net >= 0;
            
            return (
              <div
                key={type}
                className={`border-2 rounded-xl p-5 transition-all card-hover ${
                  isProfit
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{type}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    type === 'Stocks'
                      ? 'bg-green-100 text-green-800'
                      : type === 'Commodity'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {count} trades
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net P/L:</span>
                    <span className={`text-2xl font-bold tabular-nums ${isProfit ? 'text-profit' : 'text-loss'}`}>
                      <AnimatedCounter 
                        value={stats.net} 
                        prefix={isProfit ? '+₹' : '₹'} 
                        decimals={2}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total Profit:</span>
                    <span className="text-profit font-semibold tabular-nums">
                      <AnimatedCounter value={stats.profit} prefix="₹" decimals={2} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Loss:</span>
                    <span className="text-loss font-semibold tabular-nums">
                      <AnimatedCounter value={stats.loss} prefix="₹" decimals={2} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Balance Over Time</h2>
        <BalanceChart data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Trades</h2>
          {data.trades.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No trades yet</p>
          ) : (
            <div className="space-y-3">
              {data.trades.slice(-5).reverse().map((trade) => (
                <div
                  key={trade.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{trade.stocks || 'N/A'}</p>
                      {trade.tradeType && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          trade.tradeType === 'Stocks'
                            ? 'bg-green-100 text-green-800'
                            : trade.tradeType === 'Commodity'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {trade.tradeType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDateDDMMYY(trade.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    {trade.profit ? (
                      <div>
                        <p className="text-profit font-semibold">
                          +₹{(trade.profit - (trade.commission || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {trade.commission > 0 && (
                          <p className="text-xs text-gray-500">Comm: ₹{trade.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-loss font-semibold">
                          -₹{(trade.loss + (trade.commission || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {trade.commission > 0 && (
                          <p className="text-xs text-gray-500">Comm: ₹{trade.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Cash Flows</h2>
          {data.cashFlows.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No cash flows yet</p>
          ) : (
            <div className="space-y-3">
              {data.cashFlows.slice(-5).reverse().map((cf) => (
                <div
                  key={cf.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {cf.amount >= 0 ? 'Cash In' : 'Cash Out'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateDDMMYY(cf.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold tabular-nums ${cf.amount >= 0 ? 'text-profit' : 'text-loss'}`}>
                      <AnimatedCounter 
                        value={Math.abs(cf.amount)} 
                        prefix={cf.amount >= 0 ? '+₹' : '-₹'} 
                        decimals={2}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

