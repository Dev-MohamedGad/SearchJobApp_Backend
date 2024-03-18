import { Request, Response, NextFunction } from "express";

interface Error {
  cause?: number;
  message: string;
}
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.cause || 500).json({
    message: error.message,
    error,
  });
};
