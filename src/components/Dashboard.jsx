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
      value: `₹${currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Profit/Loss',
      value: `₹${totalProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalProfitLoss >= 0 ? 'text-profit' : 'text-loss',
      bgColor: totalProfitLoss >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'ROI',
      value: `${roi}%`,
      icon: Activity,
      color: parseFloat(roi) >= 0 ? 'text-profit' : 'text-loss',
      bgColor: parseFloat(roi) >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Total Cash Flow',
      value: `₹${totalCashFlow.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Opening Balance</h2>
          {!isEditingBalance ? (
            <button
              onClick={() => setIsEditingBalance(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleBalanceUpdate}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingBalance(false);
                  setNewBalance(data.openingBalance);
                }}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter opening balance"
          />
        ) : (
          <p className="text-3xl font-bold text-gray-900">
            ₹{data.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg shadow p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profit/Loss by Trade Type</h2>
        <p className="text-sm text-gray-600 mb-4">Quick overview of which trade type is profitable or losing</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Stocks', 'Commodity', 'Options'].map((type) => {
            const stats = profitLossByType[type] || { profit: 0, loss: 0, net: 0, trades: 0 };
            const count = tradeCountByType[type] || 0;
            const isProfit = stats.net >= 0;
            
            return (
              <div
                key={type}
                className={`border-2 rounded-lg p-5 transition-all ${
                  isProfit
                    ? 'border-green-300 bg-green-50 hover:bg-green-100'
                    : 'border-red-300 bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{type}</h3>
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
                    <span className="text-sm font-medium text-gray-700">Net P/L:</span>
                    <span className={`text-2xl font-bold ${isProfit ? 'text-profit' : 'text-loss'}`}>
                      {isProfit ? '+' : ''}₹{stats.net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Total Profit:</span>
                    <span className="text-profit font-semibold">
                      ₹{stats.profit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Loss:</span>
                    <span className="text-loss font-semibold">
                      ₹{stats.loss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance Over Time</h2>
        <BalanceChart data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
          {data.trades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No trades yet</p>
          ) : (
            <div className="space-y-3">
              {data.trades.slice(-5).reverse().map((trade) => (
                <div
                  key={trade.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{trade.stocks || 'N/A'}</p>
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Cash Flows</h2>
          {data.cashFlows.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No cash flows yet</p>
          ) : (
            <div className="space-y-3">
              {data.cashFlows.slice(-5).reverse().map((cf) => (
                <div
                  key={cf.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {cf.amount >= 0 ? 'Cash In' : 'Cash Out'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateDDMMYY(cf.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${cf.amount >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {cf.amount >= 0 ? '+' : ''}₹{Math.abs(cf.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

