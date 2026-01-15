import { prisma } from '../config/database';
import forexService from './forexService';
import { ConversionRequest, ConversionResponse } from '../types/index';
import { AppError } from '../middleware/errorHandler';
import { Conversion, Prisma } from '@prisma/client';

class ConversionService {
  async convertCurrency(data: ConversionRequest): Promise<ConversionResponse> {
    const { amount, baseCurrency, targetCurrency } = data;

    // Validation
    if (amount <= 0) {
      throw new AppError('Amount must be greater than zero', 400);
    }

    if (baseCurrency === targetCurrency) {
      throw new AppError('Base and target currencies must be different', 400);
    }

    // Get conversion rate
    const conversionRate = await forexService.getConversionRate(baseCurrency, targetCurrency);
    
    // Calculate converted amount
    const convertedAmount = amount * conversionRate;

    // Save to database
    const conversion = await prisma.conversion.create({
      data: {
        amount: new Prisma.Decimal(amount),
        baseCurrency: baseCurrency.toUpperCase(),
        targetCurrency: targetCurrency.toUpperCase(),
        convertedAmount: new Prisma.Decimal(convertedAmount),
        conversionRate: new Prisma.Decimal(conversionRate),
      },
    });

    return {
      id: conversion.id,
      amount: conversion.amount.toNumber(),
      baseCurrency: conversion.baseCurrency,
      targetCurrency: conversion.targetCurrency,
      convertedAmount: conversion.convertedAmount.toNumber(),
      conversionRate: conversion.conversionRate.toNumber(),
      createdAt: conversion.createdAt,
    };
  }

  async getAllConversions(): Promise<ConversionResponse[]> {
    const conversions = await prisma.conversion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return conversions.map((conversion: Conversion) => ({
      id: conversion.id,
      amount: conversion.amount.toNumber(),
      baseCurrency: conversion.baseCurrency,
      targetCurrency: conversion.targetCurrency,
      convertedAmount: conversion.convertedAmount.toNumber(),
      conversionRate: conversion.conversionRate.toNumber(),
      createdAt: conversion.createdAt,
    }));
  }
}

export default new ConversionService();