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
    const portfolio = JSON.parse(event.body);
    
    // Save opening balance
    await sql`
      INSERT INTO portfolio_settings (key, value)
      VALUES ('opening_balance', ${portfolio.openingBalance || 0})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    
    // Clear existing trades and cash flows (we'll replace all)
    await sql`DELETE FROM trades`;
    await sql`DELETE FROM cash_flows`;
    
    // Insert trades
    if (portfolio.trades && portfolio.trades.length > 0) {
      for (const trade of portfolio.trades) {
        await sql`
          INSERT INTO trades (id, date, trade_type, stocks, profit, loss, commission)
          VALUES (
            ${trade.id},
            ${trade.date},
            ${trade.tradeType || 'Stocks'},
            ${trade.stocks || ''},
            ${trade.profit || null},
            ${trade.loss || null},
            ${trade.commission || 0}
          )
        `;
      }
    }
    
    // Insert cash flows
    if (portfolio.cashFlows && portfolio.cashFlows.length > 0) {
      for (const cf of portfolio.cashFlows) {
        await sql`
          INSERT INTO cash_flows (id, date, amount)
          VALUES (${cf.id}, ${cf.date}, ${cf.amount})
        `;
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error saving portfolio:', error);
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

