import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DateInput from './DateInput';

const EditTradeModal = ({ trade, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    tradeType: 'Stocks',
    stocks: '',
    profit: '',
    loss: '',
    commission: '',
  });

  useEffect(() => {
    if (trade && isOpen) {
      setFormData({
        date: trade.date || new Date().toISOString().split('T')[0],
        tradeType: trade.tradeType || 'Stocks',
        stocks: trade.stocks || '',
        profit: trade.profit ? trade.profit.toString() : '',
        loss: trade.loss ? trade.loss.toString() : '',
        commission: trade.commission ? trade.commission.toString() : '',
      });
    }
  }, [trade, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.stocks.trim()) {
      alert('Please enter stock name');
      return;
    }

    if (!formData.profit && !formData.loss) {
      alert('Please enter either profit or loss');
      return;
    }

    if (formData.profit && formData.loss) {
      alert('Please enter either profit OR loss, not both');
      return;
    }

    const updatedTrade = {
      ...trade,
      date: formData.date,
      tradeType: formData.tradeType,
      stocks: formData.stocks.trim(),
      profit: formData.profit ? parseFloat(formData.profit) : null,
      loss: formData.loss ? parseFloat(formData.loss) : null,
      commission: formData.commission ? parseFloat(formData.commission) : 0,
    };

    onSave(updatedTrade);
    onClose();
  };

  const handleProfitChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      profit: value,
      loss: value ? '' : formData.loss,
    });
  };

  const handleLossChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      loss: value,
      profit: value ? '' : formData.profit,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Trade</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <DateInput
              id="edit-date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="DD/MM/YY"
            />
          </div>

          <div>
            <label htmlFor="edit-tradeType" className="block text-sm font-medium text-gray-700 mb-2">
              Trade Type
            </label>
            <select
              id="edit-tradeType"
              value={formData.tradeType}
              onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Stocks">Stocks</option>
              <option value="Commodity">Commodity</option>
              <option value="Options">Options</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-stocks" className="block text-sm font-medium text-gray-700 mb-2">
              Instrument/Symbol
            </label>
            <input
              type="text"
              id="edit-stocks"
              value={formData.stocks}
              onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Gold Mini/Laurusla, NIFTY, RELIANCE, etc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-profit" className="block text-sm font-medium text-gray-700 mb-2">
                Daily Profit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="edit-profit"
                  value={formData.profit}
                  onChange={handleProfitChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-loss" className="block text-sm font-medium text-gray-700 mb-2">
                Daily Loss
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="edit-loss"
                  value={formData.loss}
                  onChange={handleLossChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="edit-commission" className="block text-sm font-medium text-gray-700 mb-2">
              Brokerage Commission
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="edit-commission"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Commission will be deducted from profit or added to loss
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Enter either profit OR loss, not both. The form will automatically clear the other field.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTradeModal;

