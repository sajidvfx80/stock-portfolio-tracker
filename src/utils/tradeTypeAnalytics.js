import { calculateTotalProfitLoss, calculateTotalCommission } from './calculations';

/**
 * Get profit/loss breakdown by trade type
 */
export const getProfitLossByTradeType = (trades) => {
  const breakdown = {
    Stocks: { profit: 0, loss: 0, commission: 0, trades: 0 },
    Commodity: { profit: 0, loss: 0, commission: 0, trades: 0 },
    Options: { profit: 0, loss: 0, commission: 0, trades: 0 },
  };

  trades.forEach(trade => {
    const tradeType = trade.tradeType || 'Stocks';
    const commission = trade.commission || 0;
    
    if (!breakdown[tradeType]) {
      breakdown[tradeType] = { profit: 0, loss: 0, commission: 0, trades: 0 };
    }

    if (trade.profit) {
      breakdown[tradeType].profit += (trade.profit - commission);
    } else if (trade.loss) {
      breakdown[tradeType].loss += (trade.loss + commission);
    }
    
    breakdown[tradeType].commission += commission;
    breakdown[tradeType].trades += 1;
  });

  // Calculate net P/L for each type
  Object.keys(breakdown).forEach(type => {
    breakdown[type].net = breakdown[type].profit - breakdown[type].loss;
  });

  return breakdown;
};

/**
 * Get trade count by type
 */
export const getTradeCountByType = (trades) => {
  const counts = {
    Stocks: 0,
    Commodity: 0,
    Options: 0,
  };

  trades.forEach(trade => {
    const tradeType = trade.tradeType || 'Stocks';
    counts[tradeType] = (counts[tradeType] || 0) + 1;
  });

  return counts;
};

/**
 * Get win rate by trade type
 */
export const getWinRateByTradeType = (trades) => {
  const winRates = {
    Stocks: { wins: 0, total: 0 },
    Commodity: { wins: 0, total: 0 },
    Options: { wins: 0, total: 0 },
  };

  trades.forEach(trade => {
    const tradeType = trade.tradeType || 'Stocks';
    const commission = trade.commission || 0;
    
    if (!winRates[tradeType]) {
      winRates[tradeType] = { wins: 0, total: 0 };
    }

    winRates[tradeType].total += 1;

    if (trade.profit && (trade.profit - commission) > 0) {
      winRates[tradeType].wins += 1;
    }
  });

  // Calculate percentages
  const result = {};
  Object.keys(winRates).forEach(type => {
    const { wins, total } = winRates[type];
    result[type] = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  });

  return result;
};

