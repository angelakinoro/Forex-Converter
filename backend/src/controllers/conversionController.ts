import { Request, Response, NextFunction } from 'express';
import conversionService from '../services/conversionService';
import forexService from '../services/forexService';
import { ConversionRequest } from '../types/index';
import { AppError } from '../middleware/errorHandler';

export const getLatestRates = async (req: Request, res: Response, next: NextFunction) => {
    const rates = await forexService.getLiveRates();
    res.json({
        success: true,
        data: rates,
    });
};

export const convertCurrency = async (req: Request, res: Response, next: NextFunction) => {
    const { amount, baseCurrency, targetCurrency, reasonId } = req.body as ConversionRequest;

    // Validation {According to research, Zod would be better here especially for larger projects but keeping it simple for now}
    if (!amount || !baseCurrency || !targetCurrency) {
        throw new AppError('Missing required fields: amount, baseCurrency, targetCurrency', 400);
    }

    if (typeof amount !== 'number') {
        throw new AppError('Amount must be a number', 400);
    }

    if (typeof baseCurrency !== 'string' || typeof targetCurrency !== 'string') {
        throw new AppError('Currency codes must be strings', 400);
    }

    if (baseCurrency.length !== 3 || targetCurrency.length !== 3) {
        throw new AppError('Currency codes must be 3 letters (e.g., USD, EUR)', 400);
    }

    const conversion = await conversionService.convertCurrency({
        amount,
        baseCurrency,
        targetCurrency,
        reasonId,
    });

    res.status(201).json({
        success: true,
        data: conversion,
    });
};

export const getAllConversions = async (req: Request, res: Response, next: NextFunction) => { // Possibly add pagination
    const conversions = await conversionService.getAllConversions();
    res.json({
        success: true,
        data: conversions,
    });
};
