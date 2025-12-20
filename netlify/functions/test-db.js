import { neon } from '@netlify/neon';

export const handler = async (event, context) => {
  try {
    // Check environment variables
    const hasDbUrl = !!process.env.NETLIFY_DATABASE_URL;
    const hasUnpooled = !!process.env.NETLIFY_DATABASE_URL_UNPOOLED;
    
    const info = {
      hasDatabaseUrl: hasDbUrl,
      hasUnpooledUrl: hasUnpooled,
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('NEON')),
    };

    if (!hasDbUrl) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'NETLIFY_DATABASE_URL not found',
          info: info,
          hint: 'Please claim your Neon database in Netlify dashboard'
        }),
      };
    }

    // Try to connect
    const sql = neon();
    
    // Simple test query
    const result = await sql`SELECT 1 as test`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Database connection successful!',
        testResult: result,
        info: info
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        info: {
          hasDatabaseUrl: !!process.env.NETLIFY_DATABASE_URL,
          hasUnpooledUrl: !!process.env.NETLIFY_DATABASE_URL_UNPOOLED,
        }
      }),
    };
  }
};

