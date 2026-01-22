export interface Reason {
    id: number;
    label: string;
}

export interface Conversion {
    id: number;
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    conversionRate: number;
    createdAt: string;
    reason?: Reason
}

export interface ConversionRequest {
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
    reasonId: number;
}

export interface ForexRatesResponse {
    base: string;
    rates: { [currency: string]: number };
    timestamp?: number;
}

export interface ApiResponse<T> { // Generic API response wrapper designed to match handshake from controllers in backend
    success: boolean;
    data: T;
    error?: {
        message: string;
    }
}