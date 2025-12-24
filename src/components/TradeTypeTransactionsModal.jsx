import { useState } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { formatDateDDMMYY } from '../utils/dateFormat';
import EditTradeModal from './EditTradeModal';
import { useToast } from '../context/ToastContext';

const TradeTypeTransactionsModal = ({ 
  isOpen, 
  onClose, 
  tradeType, 
  trades, 
  onUpdateTrade, 
  onDeleteTrade 
}) => {
  const { success } = useToast();
  const [editingTrade, setEditingTrade] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen) return null;

  // Filter trades by the selected trade type
  const filteredTrades = trades.filter(trade => trade.tradeType === tradeType);

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTrade) => {
    if (onUpdateTrade) {
      onUpdateTrade(updatedTrade);
      success('Trade updated successfully!', { title: 'Success' });
    }
    setIsEditModalOpen(false);
    setEditingTrade(null);
  };

  const handleDelete = (trade) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      if (onDeleteTrade) {
        onDeleteTrade(trade.id);
        success('Trade deleted successfully!', { title: 'Success' });
      }
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {tradeType} Transactions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredTrades.length} {filteredTrades.length === 1 ? 'trade' : 'trades'} found
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTrades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No {tradeType} trades found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Instrument
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Net Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTrades
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((trade) => {
                        const commission = trade.commission || 0;
                        const netProfit = trade.profit ? (trade.profit - commission) : 0;
                        const netLoss = trade.loss ? (trade.loss + commission) : 0;
                        const isProfit = netProfit > 0;

                        return (
                          <tr
                            key={trade.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDateDDMMYY(trade.date)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {trade.stocks || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium tabular-nums">
                              {isProfit ? (
                                <span className="text-profit">
                                  +₹{netProfit.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              ) : (
                                <span className="text-loss">
                                  -₹{netLoss.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400 tabular-nums">
                              {commission > 0 ? (
                                <span>₹{commission.toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleEdit(trade)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                  title="Edit trade"
                                  aria-label="Edit trade"
                                >
                                  <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(trade)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                  title="Delete trade"
                                  aria-label="Delete trade"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary px-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Edit Trade Modal */}
      <EditTradeModal
        trade={editingTrade}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrade(null);
        }}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default TradeTypeTransactionsModal;

