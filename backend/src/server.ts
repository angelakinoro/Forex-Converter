import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import conversionRoutes from './routes/conversionRoutes'
import { errorHandler } from './middleware/errorHandler';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use('/api', conversionRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;