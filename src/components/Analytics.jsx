import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle } from 'lucide-react';
import {
  calculateTotalProfitLoss,
  calculateROI,
  getWinRate,
  getBestTrade,
  getWorstTrade,
  getDailyStats,
  calculateTotalCommission,
} from '../utils/calculations';
import {
  getProfitLossByTradeType,
  getTradeCountByType,
  getWinRateByTradeType,
} from '../utils/tradeTypeAnalytics';
import { formatDateDDMMYY } from '../utils/dateFormat';
import ProfitLossChart from './ProfitLossChart';

const Analytics = ({ data }) => {
  const totalProfitLoss = calculateTotalProfitLoss(data.trades);
  const roi = calculateROI(
    data.openingBalance,
    totalProfitLoss,
    data.cashFlows.reduce((sum, cf) => sum + Math.abs(cf.amount), 0)
  );
  const winRate = getWinRate(data.trades);
  const bestTrade = getBestTrade(data.trades);
  const worstTrade = getWorstTrade(data.trades);
  const dailyStats = getDailyStats(data.trades);
  
  // Trade type analytics
  const profitLossByType = getProfitLossByTradeType(data.trades);
  const tradeCountByType = getTradeCountByType(data.trades);
  const winRateByType = getWinRateByTradeType(data.trades);

  const totalTrades = data.trades.length;
  const winningTrades = data.trades.filter(t => {
    const commission = t.commission || 0;
    return t.profit && (t.profit - commission) > 0;
  }).length;
  const losingTrades = data.trades.filter(t => {
    const commission = t.commission || 0;
    return t.loss && (t.loss + commission) > 0;
  }).length;
  const totalCommission = calculateTotalCommission(data.trades);

  const avgProfit = useMemo(() => {
    const profits = data.trades.filter(t => t.profit && t.profit > 0).map(t => t.profit);
    return profits.length > 0
      ? profits.reduce((sum, p) => sum + p, 0) / profits.length
      : 0;
  }, [data.trades]);

  const avgLoss = useMemo(() => {
    const losses = data.trades.filter(t => t.loss && t.loss > 0).map(t => t.loss);
    return losses.length > 0
      ? losses.reduce((sum, l) => sum + l, 0) / losses.length
      : 0;
  }, [data.trades]);

  const profitFactor = avgLoss > 0 ? (avgProfit / avgLoss).toFixed(2) : 'N/A';

  const stats = [
    {
      label: 'Total Trades',
      value: totalTrades,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      icon: Award,
      color: parseFloat(winRate) >= 50 ? 'text-profit' : 'text-loss',
      bgColor: parseFloat(winRate) >= 50 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'ROI',
      value: `${roi}%`,
      icon: parseFloat(roi) >= 0 ? TrendingUp : TrendingDown,
      color: parseFloat(roi) >= 0 ? 'text-profit' : 'text-loss',
      bgColor: parseFloat(roi) >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Profit Factor',
      value: profitFactor,
      icon: TrendingUp,
      color: profitFactor !== 'N/A' && parseFloat(profitFactor) >= 1 ? 'text-profit' : 'text-loss',
      bgColor: profitFactor !== 'N/A' && parseFloat(profitFactor) >= 1 ? 'bg-green-50' : 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg shadow p-6`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Winning Trades</span>
              <span className="text-profit font-bold text-lg">{winningTrades}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <span className="text-gray-700 font-medium">Losing Trades</span>
              <span className="text-loss font-bold text-lg">{losingTrades}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Average Profit</span>
              <span className="text-profit font-bold text-lg">
                ₹{avgProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Average Loss</span>
              <span className="text-loss font-bold text-lg">
                ₹{avgLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Best & Worst Trades</h2>
          <div className="space-y-4">
            {bestTrade ? (
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-profit" />
                  <span className="font-semibold text-gray-900">Best Trade</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {bestTrade.stocks || 'N/A'} • {formatDateDDMMYY(bestTrade.date)}
                </p>
                <p className="text-2xl font-bold text-profit">
                  +₹{((bestTrade.profit || 0) - (bestTrade.commission || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {bestTrade.commission > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    (Gross: ₹{bestTrade.profit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - Comm: ₹{bestTrade.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}))
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">No profitable trades yet</span>
              </div>
            )}

            {worstTrade ? (
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-loss" />
                  <span className="font-semibold text-gray-900">Worst Trade</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {worstTrade.stocks || 'N/A'} • {formatDateDDMMYY(worstTrade.date)}
                </p>
                <p className="text-2xl font-bold text-loss">
                  -₹{((worstTrade.loss || 0) + (worstTrade.commission || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {worstTrade.commission > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    (Gross: ₹{worstTrade.loss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + Comm: ₹{worstTrade.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}))
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">No losing trades yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Profit/Loss Trend</h2>
        <ProfitLossChart dailyStats={dailyStats} />
      </div>

      {dailyStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Performance Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loss
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net P/L
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyStats.slice().reverse().map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateDDMMYY(day.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-profit">
                      ₹{day.profit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-loss">
                      ₹{day.loss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      ₹{(day.commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={day.net >= 0 ? 'text-profit' : 'text-loss'}>
                        {day.net >= 0 ? '+' : ''}₹{day.net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {day.trades}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance by Trade Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Stocks', 'Commodity', 'Options'].map((type) => {
            const stats = profitLossByType[type] || { profit: 0, loss: 0, commission: 0, net: 0, trades: 0 };
            const count = tradeCountByType[type] || 0;
            const winRate = winRateByType[type] || '0.0';
            
            return (
              <div key={type} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{type}</h3>
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
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Net P/L:</span>
                    <span className={`font-semibold ${stats.net >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {stats.net >= 0 ? '+' : ''}₹{stats.net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profit:</span>
                    <span className="text-profit font-medium">
                      ₹{stats.profit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Loss:</span>
                    <span className="text-loss font-medium">
                      ₹{stats.loss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission:</span>
                    <span className="text-gray-700 font-medium">
                      ₹{stats.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Win Rate:</span>
                    <span className={`font-semibold ${parseFloat(winRate) >= 50 ? 'text-profit' : 'text-loss'}`}>
                      {winRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

