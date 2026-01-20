import axios from 'axios';
import { Conversion, ConversionRequest, ForexRatesResponse, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conversionApi = {
  // Convert currency
  convert: async (data: ConversionRequest): Promise<Conversion> => {
    const response = await api.post<ApiResponse<Conversion>>('/convert', data);
    return response.data.data;
  },

  // Get all conversions
  getHistory: async (): Promise<Conversion[]> => {
    const response = await api.get<ApiResponse<Conversion[]>>('/conversions');
    return response.data.data;
  },

  // Get 
  getRates: async (): Promise<ForexRatesResponse> => {
    const response = await api.get<ApiResponse<ForexRatesResponse>>('/rates');
    return response.data.data;
  },
};