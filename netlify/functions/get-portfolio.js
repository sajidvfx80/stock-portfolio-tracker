import { neon } from '@netlify/neon';

export const handler = async (event, context) => {
  try {
    if (!process.env.NETLIFY_DATABASE_URL) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'Database URL not configured. Please claim your Neon database in Netlify dashboard.' 
        }),
      };
    }

    const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
    
    // Get opening balance
    const [balanceRow] = await sql`
      SELECT value FROM portfolio_settings WHERE key = 'opening_balance'
    `;
    
    // Get all trades
    const trades = await sql`
      SELECT * FROM trades ORDER BY date DESC, id DESC
    `;
    
    // Get all cash flows
    const cashFlows = await sql`
      SELECT * FROM cash_flows ORDER BY date DESC, id DESC
    `;
    
    const portfolio = {
      openingBalance: balanceRow?.value || 0,
      trades: trades.map(trade => ({
        id: trade.id,
        date: trade.date,
        tradeType: trade.trade_type,
        stocks: trade.stocks,
        profit: trade.profit,
        loss: trade.loss,
        commission: trade.commission || 0,
      })),
      cashFlows: cashFlows.map(cf => ({
        id: cf.id,
        date: cf.date,
        amount: cf.amount,
      })),
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(portfolio),
    };
  } catch (error) {
    console.error('Error getting portfolio:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

