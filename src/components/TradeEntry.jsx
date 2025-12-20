import { useState } from 'react';
import { Plus } from 'lucide-react';
import DateInput from './DateInput';

const TradeEntry = ({ onAddTrade }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tradeType: 'Stocks',
    stocks: '',
    profit: '',
    loss: '',
    commission: '',
  });

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

    const trade = {
      date: formData.date,
      tradeType: formData.tradeType,
      stocks: formData.stocks.trim(),
      profit: formData.profit ? parseFloat(formData.profit) : null,
      loss: formData.loss ? parseFloat(formData.loss) : null,
      commission: formData.commission ? parseFloat(formData.commission) : 0,
    };

    onAddTrade(trade);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      tradeType: 'Stocks',
      stocks: '',
      profit: '',
      loss: '',
      commission: '',
    });

    alert('Trade added successfully!');
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
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Trade</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <DateInput
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="DD/MM/YY"
          />
        </div>

        <div>
          <label htmlFor="tradeType" className="block text-sm font-medium text-gray-700 mb-2">
            Trade Type
          </label>
          <select
            id="tradeType"
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
          <label htmlFor="stocks" className="block text-sm font-medium text-gray-700 mb-2">
            Instrument/Symbol
          </label>
          <input
            type="text"
            id="stocks"
            value={formData.stocks}
            onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Gold Mini/Laurusla, NIFTY, RELIANCE, etc."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="profit" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Profit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="profit"
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
            <label htmlFor="loss" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Loss
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="loss"
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
          <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-2">
            Brokerage Commission
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              id="commission"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Trade
        </button>
      </form>
    </div>
  );
};

export default TradeEntry;

