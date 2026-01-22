import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const getReasons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('getReasons called');
        console.log('About to query Prisma...');
        
        const reasons = await prisma.reason.findMany();
        
        console.log('Got reasons:', reasons);
        console.log('Count:', reasons.length);
        
        res.json({
            success: true,
            data: reasons,
        });
        
        console.log('Response sent');
    } catch (error) {
        console.error('RROR in getReasons:', error);
        next(error);
    }
}