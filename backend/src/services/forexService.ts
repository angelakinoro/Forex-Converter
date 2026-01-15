import axios, { AxiosError } from "axios";
import { ForexRatesResponse } from "../types/index";
import { AppError } from "../middleware/errorHandler";

// response types for forex API responses
interface ForexApiResponse {
    success: boolean;
    terms: string;
    privacy: string;
    timestamp: number;
    source: string;
    quotes: Record<string, number>;
    error?: {
        code: number;
        info: string;
    };
}

interface ConversionAPIResponse {
    success: boolean;
    terms: string;
    privacy: string;
    query: {
        from: string;
        to: string;
        amount: number;
    };
    info: {
        timestamp: number;
        quote: number;
    };
    result: number;
    error?: {
        code: number;
        info: string;
    };
}

class ForexService {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.FOREX_API_KEY || '';
        this.baseUrl = 'http://api.exchangerate.host';


        console.log('Raw FOREX_API_KEY from env:', process.env.FOREX_API_KEY);
        console.log('API Key length:', this.apiKey.length);
        console.log('API Key value:', this.apiKey);
        console.log('Base URL:', this.baseUrl);

        if (!this.apiKey) {
            console.warn('API KEY not set');
        }
    }

    async getLiveRates(): Promise<ForexRatesResponse> {
        try {
            const url = `${this.baseUrl}/live?access_key=${this.apiKey}&format=1`;
            const response = await axios.get<ForexApiResponse>(url);
            
            if (!response.data.success) {
                throw new AppError(response.data.error?.info || 'Failed to fetch rates', 502);
            }

            // Transform the quotes object to remove the source currency prefix like the USDEUR to EUR
            const rates: { [currency: string]: number } = {};
            const sourcePrefix = response.data.source;
            
            for (const [key, value] of Object.entries(response.data.quotes)) {
                const currency = key.replace(sourcePrefix, '');
                rates[currency] = value;
            }
            
            return {
                base: response.data.source,
                rates: rates,
                timestamp: response.data.timestamp
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    const errorData = error.response.data as ForexApiResponse;
                    throw new AppError(
                        `Forex API error: ${errorData.error?.info || 'Unknown error'}`,
                        error.response.status
                    );
                } else if (error.request) {
                    throw new AppError('No response from Forex API', 503);
                }
            }
            throw new AppError('Failed to fetch forex rates', 500);
        }
    }

    async getConversionRate(baseCurrency: string, targetCurrency: string): Promise<number> {
        try {
            const url = `${this.baseUrl}/convert`;
            const response = await axios.get<ConversionAPIResponse>(url, {
                params: {
                    access_key: this.apiKey,
                    from: baseCurrency.toUpperCase(),
                    to: targetCurrency.toUpperCase(),
                    amount: 1, // Rate for 1 unit
                    format: 1
                },
            });
            
            if (!response.data.success) {
                throw new AppError(response.data.error?.info || 'Conversion failed', 400);
            }

            return response.data.info.quote;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    const errorData = error.response.data as ConversionAPIResponse;
                    throw new AppError(
                        errorData?.error?.info || 'Invalid currency pair',
                        error.response.status
                    );
                } else if (error.request) {
                    throw new AppError('No response from Forex API', 503);
                }
            }
            throw new AppError('Failed to fetch conversion rate', 500);
        }
    }
}

export default new ForexService();