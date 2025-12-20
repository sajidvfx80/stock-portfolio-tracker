import { neon } from '@netlify/neon';

export const handler = async (event, context) => {
  try {
    // Check if database URL is available
    if (!process.env.NETLIFY_DATABASE_URL) {
      console.error('NETLIFY_DATABASE_URL is not set');
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
    
    console.log('Initializing database tables...');
    
    // Create portfolio_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        key VARCHAR(255) PRIMARY KEY,
        value NUMERIC DEFAULT 0
      )
    `;
    console.log('portfolio_settings table created/verified');
    
    // Create trades table
    await sql`
      CREATE TABLE IF NOT EXISTS trades (
        id BIGINT PRIMARY KEY,
        date DATE NOT NULL,
        trade_type VARCHAR(50) DEFAULT 'Stocks',
        stocks VARCHAR(255),
        profit NUMERIC,
        loss NUMERIC,
        commission NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('trades table created/verified');
    
    // Create cash_flows table
    await sql`
      CREATE TABLE IF NOT EXISTS cash_flows (
        id BIGINT PRIMARY KEY,
        date DATE NOT NULL,
        amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('cash_flows table created/verified');
    
    // Initialize opening balance if not exists
    await sql`
      INSERT INTO portfolio_settings (key, value)
      VALUES ('opening_balance', 0)
      ON CONFLICT (key) DO NOTHING
    `;
    console.log('Opening balance initialized');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Database initialized successfully',
        tables: ['portfolio_settings', 'trades', 'cash_flows']
      }),
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.stack,
        hint: 'Check Netlify function logs for more details'
      }),
    };
  }
};

