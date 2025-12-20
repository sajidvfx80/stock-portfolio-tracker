import emailjs from '@emailjs/browser';
import {
  calculateBalance,
  calculateTotalProfitLoss,
  calculateTotalCashFlow,
  calculateROI,
  getWinRate,
} from './calculations';
import { formatDateDDMMYY } from './dateFormat';

// EmailJS Configuration
// You'll need to set up EmailJS account and get these values
// Visit https://www.emailjs.com/ to create a free account
const EMAILJS_SERVICE_ID = 'service_m1sanlg'; // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_n5hqtil'; // Your EmailJS template ID
const EMAILJS_PUBLIC_KEY = '_IzestIzH_npYQeZV'; // Your EmailJS public key

const RECIPIENT_EMAIL = 'sajidvfx@yahoo.com';

export const formatPortfolioForEmail = (data) => {

  const currentBalance = calculateBalance(
    data.openingBalance,
    data.trades,
    data.cashFlows
  );
  const totalProfitLoss = calculateTotalProfitLoss(data.trades);
  const totalCashFlow = calculateTotalCashFlow(data.cashFlows);
  const roi = calculateROI(data.openingBalance, totalProfitLoss, totalCashFlow);
  const winRate = getWinRate(data.trades);

  const recentTrades = data.trades
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const recentCashFlows = data.cashFlows
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return formatDateDDMMYY(dateString);
  };

  // Create HTML email content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-label { font-size: 14px; color: #666; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; }
        .profit { color: #10b981; }
        .loss { color: #ef4444; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; }
        td { padding: 12px; border-top: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📊 Daily Portfolio Report</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${formatDate(new Date().toISOString())}</p>
        </div>
        <div class="content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Current Balance</div>
              <div class="stat-value">${formatCurrency(currentBalance)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Profit/Loss</div>
              <div class="stat-value ${totalProfitLoss >= 0 ? 'profit' : 'loss'}">
                ${totalProfitLoss >= 0 ? '+' : ''}${formatCurrency(totalProfitLoss)}
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">ROI</div>
              <div class="stat-value ${parseFloat(roi) >= 0 ? 'profit' : 'loss'}">
                ${roi}%
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Win Rate</div>
              <div class="stat-value">${winRate}%</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📈 Portfolio Summary</div>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>Opening Balance</td>
                <td>${formatCurrency(data.openingBalance)}</td>
              </tr>
              <tr>
                <td>Total Cash Flow</td>
                <td>${formatCurrency(totalCashFlow)}</td>
              </tr>
              <tr>
                <td>Total Trades</td>
                <td>${data.trades.length}</td>
              </tr>
              <tr>
                <td>Winning Trades</td>
                <td>${data.trades.filter(t => t.profit && t.profit > 0).length}</td>
              </tr>
              <tr>
                <td>Losing Trades</td>
                <td>${data.trades.filter(t => t.loss && t.loss > 0).length}</td>
              </tr>
            </table>
          </div>

          ${recentTrades.length > 0 ? `
          <div class="section">
            <div class="section-title">📋 Recent Trades</div>
            <table>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Instrument</th>
                <th>Profit/Loss</th>
              </tr>
              ${recentTrades.map(trade => {
                const commission = trade.commission || 0;
                const netProfit = trade.profit ? (trade.profit - commission) : 0;
                const netLoss = trade.loss ? (trade.loss + commission) : 0;
                return `
                <tr>
                  <td>${formatDate(trade.date)}</td>
                  <td>${trade.tradeType || 'Stocks'}</td>
                  <td>${trade.stocks || 'N/A'}</td>
                  <td class="${netProfit > 0 ? 'profit' : 'loss'}">
                    ${netProfit > 0 
                      ? `+${formatCurrency(netProfit)}` 
                      : netLoss > 0
                      ? `-${formatCurrency(netLoss)}`
                      : formatCurrency(0)}
                    ${commission > 0 ? ` <small>(Comm: ${formatCurrency(commission)})</small>` : ''}
                  </td>
                </tr>
              `;
              }).join('')}
            </table>
          </div>
          ` : ''}

          ${recentCashFlows.length > 0 ? `
          <div class="section">
            <div class="section-title">💰 Recent Cash Flows</div>
            <table>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
              ${recentCashFlows.map(cf => `
                <tr>
                  <td>${formatDate(cf.date)}</td>
                  <td>${cf.amount >= 0 ? 'Cash In' : 'Cash Out'}</td>
                  <td class="${cf.amount >= 0 ? 'profit' : 'loss'}">
                    ${cf.amount >= 0 ? '+' : ''}${formatCurrency(Math.abs(cf.amount))}
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}

          <div class="footer">
            <p>This is an automated daily portfolio report from Sajid Stock Portfolio Tracker</p>
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version for email clients that don't support HTML
  const textContent = `
Daily Portfolio Report - ${formatDate(new Date().toISOString())}

PORTFOLIO SUMMARY:
- Current Balance: ${formatCurrency(currentBalance)}
- Total Profit/Loss: ${totalProfitLoss >= 0 ? '+' : ''}${formatCurrency(totalProfitLoss)}
- ROI: ${roi}%
- Win Rate: ${winRate}%
- Opening Balance: ${formatCurrency(data.openingBalance)}
- Total Cash Flow: ${formatCurrency(totalCashFlow)}
- Total Trades: ${data.trades.length}
- Winning Trades: ${data.trades.filter(t => t.profit && t.profit > 0).length}
- Losing Trades: ${data.trades.filter(t => t.loss && t.loss > 0).length}

${recentTrades.length > 0 ? `
RECENT TRADES:
${recentTrades.map(trade => 
  (() => {
    const commission = trade.commission || 0;
    const netProfit = trade.profit ? (trade.profit - commission) : 0;
    const netLoss = trade.loss ? (trade.loss + commission) : 0;
    const amount = netProfit > 0 ? netProfit : netLoss;
    return `${formatDate(trade.date)} | ${trade.tradeType || 'Stocks'} - ${trade.stocks || 'N/A'} | ${netProfit > 0 ? '+' : '-'}${formatCurrency(amount)}${commission > 0 ? ` (Comm: ${formatCurrency(commission)})` : ''}`;
  })()
).join('\n')}
` : ''}

${recentCashFlows.length > 0 ? `
RECENT CASH FLOWS:
${recentCashFlows.map(cf => 
  `${formatDate(cf.date)} | ${cf.amount >= 0 ? 'Cash In' : 'Cash Out'} | ${cf.amount >= 0 ? '+' : ''}${formatCurrency(Math.abs(cf.amount))}`
).join('\n')}
` : ''}

Generated on ${new Date().toLocaleString('en-IN')}
  `.trim();

  return {
    html: htmlContent,
    text: textContent,
    subject: `Daily Portfolio Report - ${formatDate(new Date().toISOString())}`,
  };
};

export const sendPortfolioEmail = async (data) => {
  try {
    // Initialize EmailJS with public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const emailContent = formatPortfolioForEmail(data);

    const templateParams = {
      to_email: RECIPIENT_EMAIL,
      subject: emailContent.subject,
      message_html: emailContent.html,
      message_text: emailContent.text,
      date: formatDateDDMMYY(new Date().toISOString()),
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

