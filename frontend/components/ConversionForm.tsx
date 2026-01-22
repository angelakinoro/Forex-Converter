import React, { useState } from 'react';
import { ConversionRequest, Reason } from '@/types';

interface ConversionFormProps {
  // Called when user submits form  
  onConvert: (data: ConversionRequest) => void;
  isLoading: boolean;
  reasons: Reason[];
}

const ConversionForm = ({ onConvert, isLoading, reasons }: ConversionFormProps) => {

  const [amount, setAmount] = useState<string>(''); // Use string to allow empty input and decimal points
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [reasonId, setReasonId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Common currencies for the dropdown
  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
    'INR', 'MXN', 'BRL', 'ZAR', 'KES', 'NGN'
  ];


  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!baseCurrency || baseCurrency.length !== 3) {
      newErrors.baseCurrency = 'Please select a valid currency';
    }

    if (!targetCurrency || targetCurrency.length !== 3) {
      newErrors.targetCurrency = 'Please select a valid currency';
    }

    if (baseCurrency === targetCurrency) {
      newErrors.targetCurrency = 'Base and target currencies must be different';
    }

    if (!reasonId) {
      newErrors.reason = 'Please select a reason for conversion';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onConvert({
        amount: parseFloat(amount),
        baseCurrency,
        targetCurrency,
        reasonId: parseInt(reasonId)
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Convert Currency
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter amount"
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Base Currency */}
        <div>
          <label htmlFor="baseCurrency" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <select
            id="baseCurrency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.baseCurrency ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.baseCurrency && (
            <p className="text-red-500 text-sm mt-1">{errors.baseCurrency}</p>
          )}
        </div>

        {/* Target Currency */}
        <div>
          <label htmlFor="targetCurrency" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <select
            id="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.targetCurrency ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.targetCurrency && (
            <p className="text-red-500 text-sm mt-1">{errors.targetCurrency}</p>
          )}
        </div>

        {/* Reasons  */}
        <div>
          <label htmlFor="reasonId" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Conversion(Optional)
          </label>
          <select 
            id="reasonId"
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            >
            <option value="">Select a reason</option>
            
             {reasons.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.label}
              </option>
            ))}
          </select>

          {/* <pre>{JSON.stringify(reasons, null, 2)}</pre> */}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Converting...' : 'Convert'}
        </button>
      </form>
    </div>
  );
};

export default ConversionForm;