import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import conversionRoutes from './routes/conversionRoutes';
import { errorHandler } from './middleware/errorHandler';

console.log('Imports successful');

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Middleware registered');

// API Routes
app.use('/api', conversionRoutes);

console.log('Routes registered at /api');

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`    Server running on http://localhost:${PORT}`);
    console.log(`  - http://localhost:${PORT}/api/rates`);
    console.log(`  - http://localhost:${PORT}/api/conversions`);
    console.log(`  - http://localhost:${PORT}/api/reasons`);
});

export default app;