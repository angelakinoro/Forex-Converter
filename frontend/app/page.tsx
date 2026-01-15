'use client';

import React, { useState, useEffect } from 'react';
import ConversionForm from '@/components/ConversionForm';
import ConversionResult from '@/components/ConversionResult';
import ConversionHistory from '@/components/ConversionHistory';
import { conversionApi } from '@/services/api';
import { Conversion, ConversionRequest } from '@/types';

const Home = () => {
  const [currentConversion, setCurrentConversion] = useState<Conversion | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversion history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await conversionApi.getHistory();
      setConversions(data);
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError('Failed to load conversion history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleConvert = async (data: ConversionRequest) => {
    try {
      setError(null);
      setIsConverting(true);
      
      const result = await conversionApi.convert(data);
      setCurrentConversion(result);
      
      // Add new conversion to the top of the list
      setConversions([result, ...conversions]);
    } catch (err: any) {
      console.error('Error converting:', err);
      setError(
        err.response?.data?.error?.message || 
        'Failed to convert currency. Please try again.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Forex Currency Converter
        </h1>
        <p className="text-gray-900 mb-8">
          Convert currencies using real-time exchange rates
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Conversion Form - Left Column */}
          <div className="lg:col-span-2">
            <ConversionForm onConvert={handleConvert} isLoading={isConverting} />
          </div>

          {/* Result - Right Column */}
          <div className="lg:col-span-1">
            <ConversionResult conversion={currentConversion} />
          </div>
        </div>

        {/* Conversion History - Full Width */}
        <ConversionHistory conversions={conversions} isLoading={isLoadingHistory} />
      </div>
    </main>
  );
};

export default Home;