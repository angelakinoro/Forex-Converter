import { Router } from 'express';
import {getLatestRates, convertCurrency, getAllConversions,
} from '../controllers/conversionController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Fetch latest forex rates
router.get('/rates', asyncHandler(getLatestRates));

// Convert currency and save to DB
router.post('/convert', asyncHandler(convertCurrency));

// Get all past conversions
router.get('/conversions', asyncHandler(getAllConversions));

export default router;