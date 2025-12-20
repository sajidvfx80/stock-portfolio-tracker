import { format, parseISO } from 'date-fns';

export const calculateBalance = (openingBalance, trades, cashFlows) => {
  // Ensure openingBalance is a number
  let balance = Number(openingBalance) || 0;
  
  // Add cash flows
  const sortedCashFlows = [...cashFlows].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  sortedCashFlows.forEach(cf => {
    balance += Number(cf.amount) || 0;
  });
  
  // Add trades profit/loss
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  sortedTrades.forEach(trade => {
    const commission = Number(trade.commission) || 0;
    if (trade.profit) {
      balance += (Number(trade.profit) || 0) - commission; // Deduct commission from profit
    } else if (trade.loss) {
      balance -= ((Number(trade.loss) || 0) + commission); // Add commission to loss
    }
  });
  
  return balance;
};

export const calculateTotalProfitLoss = (trades) => {
  return trades.reduce((total, trade) => {
    const commission = Number(trade.commission) || 0;
    if (trade.profit) {
      return total + ((Number(trade.profit) || 0) - commission); // Net profit after commission
    } else if (trade.loss) {
      return total - ((Number(trade.loss) || 0) + commission); // Net loss including commission
    }
    return total;
  }, 0);
};

export const calculateTotalCashFlow = (cashFlows) => {
  return cashFlows.reduce((total, cf) => total + (Number(cf.amount) || 0), 0);
};

export const calculateROI = (openingBalance, totalProfitLoss, totalCashFlow) => {
  const totalInvested = (Number(openingBalance) || 0) + (Number(totalCashFlow) || 0);
  if (totalInvested === 0) return 0;
  return ((Number(totalProfitLoss) || 0) / totalInvested * 100).toFixed(2);
};

export const getWinRate = (trades) => {
  if (trades.length === 0) return 0;
  const winningTrades = trades.filter(t => {
    const commission = t.commission || 0;
    if (t.profit) {
      return (t.profit - commission) > 0; // Net profit after commission
    }
    return false;
  }).length;
  return ((winningTrades / trades.length) * 100).toFixed(1);
};

export const getBestTrade = (trades) => {
  const profitableTrades = trades.filter(t => {
    const commission = t.commission || 0;
    return t.profit && (t.profit - commission) > 0;
  });
  if (profitableTrades.length === 0) return null;
  return profitableTrades.reduce((best, trade) => {
    const bestCommission = best.commission || 0;
    const tradeCommission = trade.commission || 0;
    const bestNet = best.profit - bestCommission;
    const tradeNet = trade.profit - tradeCommission;
    return tradeNet > bestNet ? trade : best;
  });
};

export const getWorstTrade = (trades) => {
  const losingTrades = trades.filter(t => {
    const commission = t.commission || 0;
    return t.loss && (t.loss + commission) > 0;
  });
  if (losingTrades.length === 0) return null;
  return losingTrades.reduce((worst, trade) => {
    const worstCommission = worst.commission || 0;
    const tradeCommission = trade.commission || 0;
    const worstNet = worst.loss + worstCommission;
    const tradeNet = trade.loss + tradeCommission;
    return tradeNet > worstNet ? trade : worst;
  });
};

export const calculateTotalCommission = (trades) => {
  return trades.reduce((total, trade) => {
    return total + (trade.commission || 0);
  }, 0);
};

export const getDailyStats = (trades) => {
  const dailyStats = {};
  
  trades.forEach(trade => {
    const date = format(parseISO(trade.date), 'yyyy-MM-dd');
    if (!dailyStats[date]) {
      dailyStats[date] = { profit: 0, loss: 0, trades: 0 };
    }
    
    if (trade.profit) {
      dailyStats[date].profit += trade.profit;
    } else if (trade.loss) {
      dailyStats[date].loss += trade.loss;
    }
    dailyStats[date].trades += 1;
  });
  
  return Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    profit: stats.profit,
    loss: stats.loss,
    commission: stats.commission,
    net: stats.profit - stats.loss,
    trades: stats.trades,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getBalanceHistory = (openingBalance, trades, cashFlows) => {
  const history = [];
  let balance = openingBalance;
  
  // Combine and sort all transactions
  const transactions = [
    ...cashFlows.map(cf => ({ ...cf, type: 'cash', amount: cf.amount })),
    ...trades.map(t => {
      const commission = t.commission || 0;
      let netAmount = 0;
      if (t.profit) {
        netAmount = t.profit - commission; // Net profit after commission
      } else if (t.loss) {
        netAmount = -(t.loss + commission); // Net loss including commission
      }
      return {
        ...t,
        type: 'trade',
        amount: netAmount,
      };
    }),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  transactions.forEach(transaction => {
    balance += transaction.amount;
    history.push({
      date: transaction.date,
      balance,
      type: transaction.type,
    });
  });
  
  return history;
};

