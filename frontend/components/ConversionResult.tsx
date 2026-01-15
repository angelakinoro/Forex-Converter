import React from 'react';
import { Conversion } from '@/types';

interface ConversionResultProps {
  conversion: Conversion | null;
}

const ConversionResult = ({ conversion }: ConversionResultProps) => {
  if (!conversion) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-green-800 mb-3">
        Conversion Result
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium text-gray-900">
            {conversion.amount.toFixed(2)} {conversion.baseCurrency}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Converted to:</span>
          <span className="font-bold text-xl text-green-700">
            {conversion.convertedAmount.toFixed(2)} {conversion.targetCurrency}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-green-200">
          <span className="text-sm text-gray-500">Exchange Rate:</span>
          <span className="text-sm text-gray-700">
            1 {conversion.baseCurrency} = {conversion.conversionRate.toFixed(6)} {conversion.targetCurrency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversionResult;