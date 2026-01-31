import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/index.js";

/**
 * Error handler middleware
 * Centraliza tratamento de erros
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${error.name}: ${error.message}`);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.statusCode,
    });
  }

  // Default 500 error
  return res.status(500).json({
    error: "Internal server error",
    code: 500,
  });
};

/**
 * Async wrapper para rotas (para não precisar de try-catch em todas)
 */
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
