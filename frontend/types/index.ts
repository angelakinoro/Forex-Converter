export interface Conversion {
    id: number;
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    conversionRate: number;
    createdAt: Date;
}

export interface ConversionRequest {
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
}

export interface ForexRatesResponse {
    base: string;
    rates: { [currency: string]: number };
    timestamp?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: {
        message: string;
    }
}