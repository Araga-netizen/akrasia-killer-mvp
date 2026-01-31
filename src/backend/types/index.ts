import { Request } from "express";

// User types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// PDF Upload types
export interface PDFUploadRequest {
  fileName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface PDFUploadResponse {
  pdf_id: string;
  processing_status: "queued" | "processing" | "ready" | "error";
  file_name: string;
  size: number;
  uploaded_at: string;
}

export interface PDFMetadata {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  size: number;
  mime_type: string;
  s3_key: string;
  processing_status: "queued" | "processing" | "ready" | "error";
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

// Error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Request with user context
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
