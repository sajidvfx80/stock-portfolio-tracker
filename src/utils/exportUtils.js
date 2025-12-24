export const exportToCSV = (data, filename = 'portfolio') => {
  const headers = ['Date', 'Type', 'Trade Type', 'Instrument', 'Amount', 'Commission'];
  const rows = [];

  // Add trades
  data.trades.forEach(trade => {
    const amount = trade.profit 
      ? trade.profit - (trade.commission || 0)
      : -(trade.loss + (trade.commission || 0));
    rows.push([
      trade.date,
      'Trade',
      trade.tradeType || 'Stocks',
      trade.stocks || 'N/A',
      amount.toFixed(2),
      (trade.commission || 0).toFixed(2),
    ]);
  });

  // Add cash flows
  data.cashFlows.forEach(cf => {
    rows.push([
      cf.date,
      'Cash Flow',
      '-',
      cf.amount >= 0 ? 'Cash In' : 'Cash Out',
      cf.amount.toFixed(2),
      '0.00',
    ]);
  });

  // Sort by date
  rows.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = async (data, filename = 'portfolio') => {
  // For Excel export, we'll use CSV format which Excel can open
  // For true Excel format, you'd need a library like xlsx
  exportToCSV(data, filename);
};

export const exportToPDF = async (data, filename = 'portfolio') => {
  // PDF export would require a library like jsPDF or pdfmake
  // For now, we'll create a formatted HTML page that can be printed to PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Portfolio Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .profit { color: #10b981; }
          .loss { color: #ef4444; }
        </style>
      </head>
      <body>
        <h1>Portfolio Report - ${new Date().toLocaleDateString()}</h1>
        <h2>Summary</h2>
        <p>Opening Balance: ₹${data.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p>Total Trades: ${data.trades.length}</p>
        <p>Total Cash Flows: ${data.cashFlows.length}</p>
        
        <h2>Trades</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Instrument</th>
            <th>Amount</th>
            <th>Commission</th>
          </tr>
          ${data.trades.map(trade => {
            const amount = trade.profit 
              ? trade.profit - (trade.commission || 0)
              : -(trade.loss + (trade.commission || 0));
            return `
              <tr>
                <td>${trade.date}</td>
                <td>${trade.tradeType || 'Stocks'}</td>
                <td>${trade.stocks || 'N/A'}</td>
                <td class="${amount >= 0 ? 'profit' : 'loss'}">₹${amount.toFixed(2)}</td>
                <td>₹${(trade.commission || 0).toFixed(2)}</td>
              </tr>
            `;
          }).join('')}
        </table>
        
        <h2>Cash Flows</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
          ${data.cashFlows.map(cf => `
            <tr>
              <td>${cf.date}</td>
              <td>${cf.amount >= 0 ? 'Cash In' : 'Cash Out'}</td>
              <td class="${cf.amount >= 0 ? 'profit' : 'loss'}">₹${Math.abs(cf.amount).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  
  // Also open in new window for printing
  setTimeout(() => {
    window.open(url, '_blank');
  }, 100);
};

