import { prisma } from '../config/database';
import forexService from './forexService';
import { ConversionRequest, ConversionResponse } from '../types/index';
import { AppError } from '../middleware/errorHandler';
import { Conversion, Prisma } from '@prisma/client';

class ConversionService {
  async convertCurrency(data: ConversionRequest): Promise<ConversionResponse> {
    const { amount, baseCurrency, targetCurrency, reasonId } = data;

    // Validation
    if (amount <= 0) {
      throw new AppError('Amount must be greater than zero', 400);
    }

    if (baseCurrency === targetCurrency) {
      throw new AppError('Base and target currencies must be different', 400);
    }

    if (baseCurrency.length !== 3 || targetCurrency.length !== 3) {
      throw new AppError('Currency codes must be 3 letters (e.g., USD, EUR)', 400);
    }

    if (!reasonId) {
      throw new AppError('Conversion reason is required', 400);
    } 
    // Get conversion rate
    const conversionRate = await forexService.getConversionRate(baseCurrency, targetCurrency);
    
    // Calculate converted amount
    const convertedAmount = new Prisma.Decimal(amount).mul(new Prisma.Decimal(conversionRate)).toNumber();

    // Save to database
    const conversion = await prisma.conversion.create({
      data: {
        amount: new Prisma.Decimal(amount),
        baseCurrency: baseCurrency.toUpperCase(),
        targetCurrency: targetCurrency.toUpperCase(),
        convertedAmount: new Prisma.Decimal(convertedAmount),
        conversionRate: new Prisma.Decimal(conversionRate),
        reason: {
            connect: { id: Number(reasonId) } 
        }, // Associate reason by the foreign key, just fetches the id 
      },

      include: {
            reason: true // Include reason details in the response
         }
    });

    return {
      id: conversion.id,
      amount: conversion.amount.toNumber(),
      baseCurrency: conversion.baseCurrency,
      targetCurrency: conversion.targetCurrency,
      convertedAmount: conversion.convertedAmount.toNumber(),
      conversionRate: conversion.conversionRate.toNumber(),
      createdAt: conversion.createdAt,
      reason: conversion.reason ? {
            id: conversion.reason.id,
            label: conversion.reason.label
        } : undefined
    };
  }

  async getAllConversions(): Promise<ConversionResponse[]> {
    console.log('Fetching all conversions from database');
    const conversions = await prisma.conversion.findMany({
      orderBy: {
        createdAt: 'desc', // newest conversions first
      },
      include: {
            reason: true // Include reason details in the response
         }
    });

    return conversions.map((conversion) => ({
      id: conversion.id,
      amount: conversion.amount.toNumber(),
      baseCurrency: conversion.baseCurrency,
      targetCurrency: conversion.targetCurrency,
      convertedAmount: conversion.convertedAmount.toNumber(),
      conversionRate: conversion.conversionRate.toNumber(),
      createdAt: conversion.createdAt,
      reason: conversion.reason ? {
            id: conversion.reason.id,
            label: conversion.reason.label
        } : undefined
    }));
  }
}

export default new ConversionService();