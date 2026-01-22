import { Request, Response, NextFunction } from "express";
import { ApiErrorResponse } from "../types/index";

export class AppError extends Error implements ApiErrorResponse {
    statusCode: number;
    details?: any;  

    constructor(message: string, statusCode: number, details?: any) {
        super(message);
        this.statusCode = statusCode;   
        this.details = details;
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,  
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error:{
                message: err.message,
                details: err.details,
            }
        });
    }

    console.error("Unexpected error:", err);
    return res.status(500).json({
        error: {
            message: "Internal Server Error",
        }
    });
}

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    console.log('asyncHandler wrapping function:', fn.name);
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

