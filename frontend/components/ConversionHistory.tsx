import React from 'react';
import { Conversion } from '@/types';

interface ConversionHistoryProps {
  conversions: Conversion[];
  isLoading: boolean;
}

const ConversionHistory = ({ conversions, isLoading }: ConversionHistoryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Conversion History
        </h2>
        <p className="text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Conversion History
        </h2>
        <p className="text-gray-500">No conversions yet. Start by converting a currency above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Conversion History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">From</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">To</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rate</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Reason</th>
            </tr>
          </thead>
          <tbody>
            {conversions.map((conversion) => (
              <tr key={conversion.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDate(conversion.createdAt)}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {conversion.amount.toFixed(2)} {conversion.baseCurrency}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {conversion.convertedAmount.toFixed(2)} {conversion.targetCurrency}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {conversion.conversionRate.toFixed(6)}
                </td>
                {/* reason for conversion  */}
                <td className="py-3 px-4 text-sm text-gray-600">
                  {conversion.reason?.label || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversionHistory;