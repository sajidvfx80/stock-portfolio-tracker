import { useState, useMemo } from 'react';
import { Trash2, Search, Filter, Edit2 } from 'lucide-react';
import { formatDateDDMMYY } from '../utils/dateFormat';
import EditTradeModal from './EditTradeModal';
import { useToast } from '../context/ToastContext';

const TransactionHistory = ({ trades, cashFlows, onDeleteTrade, onDeleteCashFlow, onUpdateTrade }) => {
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [tradeTypeFilter, setTradeTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editingTrade, setEditingTrade] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const allTransactions = useMemo(() => {
    const transactions = [
      ...trades.map(t => ({ ...t, type: 'trade' })),
      ...cashFlows.map(cf => ({ ...cf, type: 'cashflow' })),
    ];

    let filtered = transactions;

    // Filter by type (trade/cashflow)
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by trade type (Stocks/Commodity/Options)
    if (tradeTypeFilter !== 'all' && filterType !== 'cashflow') {
      filtered = filtered.filter(t => {
        if (t.type === 'trade') {
          return t.tradeType === tradeTypeFilter;
        }
        return true; // Keep cash flows
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => {
        if (t.type === 'trade') {
          return t.stocks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 t.tradeType?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return 'cashflow'.includes(searchTerm.toLowerCase());
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortBy === 'date-desc') {
        return dateB - dateA;
      } else if (sortBy === 'date-asc') {
        return dateA - dateB;
      } else if (sortBy === 'amount-desc') {
        const amountA = a.profit || -a.loss || Math.abs(a.amount) || 0;
        const amountB = b.profit || -b.loss || Math.abs(b.amount) || 0;
        return amountB - amountA;
      } else if (sortBy === 'amount-asc') {
        const amountA = a.profit || -a.loss || Math.abs(a.amount) || 0;
        const amountB = b.profit || -b.loss || Math.abs(b.amount) || 0;
        return amountA - amountB;
      }
      return 0;
    });

    return filtered;
  }, [trades, cashFlows, searchTerm, filterType, sortBy]);

  const handleDelete = (transaction) => {
    if (confirm(`Are you sure you want to delete this ${transaction.type === 'trade' ? 'trade' : 'cash flow'}?`)) {
      if (transaction.type === 'trade') {
        onDeleteTrade(transaction.id);
      } else {
        onDeleteCashFlow(transaction.id);
      }
    }
  };

  const handleEdit = (transaction) => {
    if (transaction.type === 'trade') {
      setEditingTrade(transaction);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedTrade) => {
    if (onUpdateTrade) {
      onUpdateTrade(updatedTrade);
      success('Trade updated successfully!', { title: 'Success' });
    }
    setIsEditModalOpen(false);
    setEditingTrade(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTrade(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Transaction History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by instrument/type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Transactions</option>
              <option value="trade">Trades Only</option>
              <option value="cashflow">Cash Flows Only</option>
            </select>
          </div>

          {filterType === 'all' || filterType === 'trade' ? (
            <select
              value={tradeTypeFilter}
              onChange={(e) => setTradeTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Trade Types</option>
              <option value="Stocks">Stocks</option>
              <option value="Commodity">Commodity</option>
              <option value="Options">Options</option>
            </select>
          ) : (
            <div></div>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>

        {allTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trade Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instrument
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {allTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDateDDMMYY(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'trade'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {transaction.type === 'trade' ? 'Trade' : 'Cash Flow'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.type === 'trade' ? (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.tradeType === 'Stocks'
                              ? 'bg-green-100 text-green-800'
                              : transaction.tradeType === 'Commodity'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {transaction.tradeType || 'Stocks'}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.type === 'trade' ? (
                        transaction.stocks || 'N/A'
                      ) : (
                        transaction.amount >= 0 ? 'Cash In' : 'Cash Out'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {transaction.type === 'trade' ? (
                        (() => {
                          const commission = transaction.commission || 0;
                          const netProfit = transaction.profit ? (transaction.profit - commission) : 0;
                          const netLoss = transaction.loss ? (transaction.loss + commission) : 0;
                          if (netProfit > 0) {
                            return (
                              <span className="text-profit">
                                +₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            );
                          } else if (netLoss > 0) {
                            return (
                              <span className="text-loss">
                                -₹{netLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            );
                          }
                          return <span className="text-gray-500">₹0.00</span>;
                        })()
                      ) : (
                        <span className={transaction.amount >= 0 ? 'text-profit' : 'text-loss'}>
                          {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {transaction.type === 'trade' && transaction.commission > 0 ? (
                        <span>₹{transaction.commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        {transaction.type === 'trade' && (
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit trade"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditTradeModal
        trade={editingTrade}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default TransactionHistory;

