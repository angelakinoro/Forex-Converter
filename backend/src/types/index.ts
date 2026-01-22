// request body type for /convert endpoint
export interface ConversionRequest {
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
    reasonId: number;
}

export interface Reason {
    id: number;
    label: string;
}

// response body type for /convert endpoint
export interface ConversionResponse {
    id: number;
    amount: number;
    baseCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    conversionRate: number
    createdAt: Date
    reason?: Reason;
}

// forex response type from Forex API 
export interface ForexRatesResponse {
    base: string;
    rates: { [currency: string]: number };
    timestamp?: number;
}

// error response type
export interface ApiErrorResponse {
    message: string;
    statusCode: number;
    details?: any;
}