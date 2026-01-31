import { Router, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  recordConsent,
  getUserConsent,
  revokeConsent,
} from "../services/consentService.js";
import { AppError, AuthenticatedRequest } from "../types/index.js";

const router = Router();

/**
 * POST /api/consent/agree
 * Registrar consentimento LGPD
 *
 * Request:
 * {
 *   "privacy_policy": boolean,
 *   "data_processing": boolean,
 *   "ai_processing": boolean
 * }
 */
router.post(
  "/agree",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const { privacy_policy, data_processing, ai_processing } = req.body;

    // Validar
    if (typeof privacy_policy !== "boolean") {
      throw new AppError(400, "privacy_policy deve ser boolean");
    }
    if (typeof data_processing !== "boolean") {
      throw new AppError(400, "data_processing deve ser boolean");
    }
    if (typeof ai_processing !== "boolean") {
      throw new AppError(400, "ai_processing deve ser boolean");
    }

    // Registrar
    const consent = recordConsent(
      req.user.userId,
      privacy_policy,
      data_processing,
      ai_processing
    );

    res.status(201).json({
      message: "Consentimento registrado com sucesso",
      consent_date: consent.consentDate.toISOString(),
      version: consent.version,
    });
  })
);

/**
 * GET /api/consent/status
 * Verificar status de consentimento
 */
router.get(
  "/status",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const consent = getUserConsent(req.user.userId);

    if (!consent) {
      return res.json({ consent_active: false });
    }

    res.json({
      consent_active: !consent.revokedAt,
      consent_date: consent.consentDate.toISOString(),
      policies: consent.policies,
      revoked_at: consent.revokedAt?.toISOString() || null,
      version: consent.version,
    });
  })
);

/**
 * POST /api/consent/revoke
 * Revogar consentimento
 */
router.post(
  "/revoke",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    revokeConsent(req.user.userId);

    res.json({
      message: "Consentimento revogado com sucesso",
      revoked_at: new Date().toISOString(),
    });
  })
);

export default router;
