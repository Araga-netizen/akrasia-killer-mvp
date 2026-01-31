import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError, AuthenticatedRequest, JWTPayload } from "../types/index.js";
import { isPDFFile } from "../services/pdfService.js";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

/**
 * Middleware para validar JWT token
 * Extrai userId do token e adiciona ao request
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, "Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new AppError(401, "Token not found");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Authentication failed" });
  }
};

/**
 * Gerar JWT token
 */
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};
