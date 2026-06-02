/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("--- Global Error Diagnostic Logs ---");
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error(`Method/URL: ${req.method} ${req.originalUrl}`);
  console.error(`Error details:`, err);
  console.error("-----------------------------------");

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred in our system. Please try again.';

  return res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
};
