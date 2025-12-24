import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatDateDDMMYY } from '../utils/dateFormat';
import DateInput from './DateInput';
import { useToast } from '../context/ToastContext';

const CashFlowManager = ({ cashFlows, onAddCashFlow, onDeleteCashFlow }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'in',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      error('Please enter a valid amount');
      return;
    }

    const cashFlow = {
      date: formData.date,
      amount: formData.type === 'in' 
        ? parseFloat(formData.amount) 
        : -parseFloat(formData.amount),
    };

    onAddCashFlow(cashFlow);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: 'in',
    });

    success('Cash flow added successfully!', { title: 'Success' });
  };

  const sortedCashFlows = [...cashFlows].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const totalCashIn = cashFlows
    .filter(cf => cf.amount > 0)
    .reduce((sum, cf) => sum + cf.amount, 0);
  
  const totalCashOut = Math.abs(cashFlows
    .filter(cf => cf.amount < 0)
    .reduce((sum, cf) => sum + cf.amount, 0));

  const handleDelete = (id, amount) => {
    if (window.confirm('Are you sure you want to delete this cash flow?')) {
      onDeleteCashFlow(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Add Cash Flow</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <DateInput
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-enhanced"
              required
              placeholder="DD/MM/YY"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-enhanced"
            >
              <option value="in">Cash In</option>
              <option value="out">Cash Out</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-enhanced pl-8"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Cash Flow
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="stat-card-gradient-green rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Cash In</h3>
          <p className="text-3xl font-bold text-profit tabular-nums">
            ₹{totalCashIn.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="stat-card-gradient-red rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Cash Out</h3>
          <p className="text-3xl font-bold text-loss tabular-nums">
            ₹{totalCashOut.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cash Flow History</h2>
        
        {sortedCashFlows.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No cash flows recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCashFlows.map((cashFlow) => (
                  <tr key={cashFlow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateDDMMYY(cashFlow.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          cashFlow.amount >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {cashFlow.amount >= 0 ? 'Cash In' : 'Cash Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={cashFlow.amount >= 0 ? 'text-profit' : 'text-loss'}>
                        {cashFlow.amount >= 0 ? '+' : ''}₹{Math.abs(cashFlow.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(cashFlow.id, cashFlow.amount)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowManager;

