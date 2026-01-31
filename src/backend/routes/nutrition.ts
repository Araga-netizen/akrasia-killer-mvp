import { Router, Request, Response } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  validatePDFFile,
  uploadPDFToS3,
  savePDFMetadata,
  getPDFMetadata,
  updatePDFStatus,
} from "../services/pdfService.js";
import { AppError, AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Configure multer para uploads em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new AppError(400, "Only PDF files allowed"));
    } else {
      cb(null, true);
    }
  },
});

/**
 * POST /api/nutrition/pdf/upload
 * Upload de PDF do nutricionista
 *
 * Acceptance Criteria:
 * - Validação: arquivo máx 10MB, tipo .pdf, magic bytes
 * - Storage: S3 com criptografia AES-256
 * - Response: { pdf_id, processing_status: "queued" }
 * - Error: Se PDF protegido, retornar erro descritivo
 * - Security: Usuário só pode acessar seus PDFs
 */
router.post(
  "/pdf/upload",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    if (!req.file) {
      throw new AppError(400, "Nenhum arquivo foi enviado");
    }

    const { buffer, originalname, mimetype, size } = req.file;
    const userId = req.user.userId;

    // Validar PDF
    const validation = validatePDFFile(buffer, originalname, mimetype, size);
    if (!validation.valid) {
      throw new AppError(400, validation.error || "PDF inválido");
    }

    console.log(`[E1-S1] Iniciando upload de PDF: ${originalname} (${size} bytes)`);

    // Upload para S3
    const { s3Key, pdfId } = await uploadPDFToS3(buffer, originalname, userId);

    // Salvar metadados
    const metadata = savePDFMetadata(
      pdfId,
      userId,
      originalname,
      s3Key,
      size,
      mimetype
    );

    console.log(`[E1-S1] PDF salvo com ID: ${pdfId}`);

    res.status(201).json({
      pdf_id: pdfId,
      processing_status: metadata.processing_status,
      file_name: originalname,
      size: size,
      uploaded_at: metadata.created_at.toISOString(),
    });
  })
);

/**
 * GET /api/nutrition/pdf/:pdf_id/status
 * Verificar status do processamento
 */
router.get(
  "/pdf/:pdf_id/status",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const { pdf_id } = req.params;
    const userId = req.user.userId;

    // Recuperar metadados
    const metadata = getPDFMetadata(pdf_id, userId);

    if (!metadata) {
      throw new AppError(404, "PDF não encontrado");
    }

    res.json({
      status: metadata.processing_status,
      progress: metadata.processing_status === "processing" ? 50 : 100,
      error: metadata.error_message,
    });
  })
);

export default router;
