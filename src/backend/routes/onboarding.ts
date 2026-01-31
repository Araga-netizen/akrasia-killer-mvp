import { Router, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  createOnboardingSession,
  completeOnboardingSession,
  getOnboardingSession,
} from "../services/onboardingService.js";
import { AppError, AuthenticatedRequest } from "../types/index.js";

const router = Router();

/**
 * POST /api/onboarding/select-path
 * Usuário escolhe: PDF ou Quiz
 *
 * Request: { path: "pdf" | "quiz" }
 * Response: { session_id, path, redirect_url }
 */
router.post(
  "/select-path",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const { path } = req.body;

    if (!path || (path !== "pdf" && path !== "quiz")) {
      throw new AppError(400, "Path deve ser 'pdf' ou 'quiz'");
    }

    // Criar sessão
    const session = createOnboardingSession(req.user.userId, path);

    // Determinar URL de redirecionamento
    const redirectUrl = path === "pdf"
      ? "/api/nutrition/pdf/upload"
      : "/api/nutrition/quiz";

    res.status(201).json({
      session_id: session.sessionId,
      path: session.path,
      redirect_url: redirectUrl,
      message: `Caminho selecionado: ${path === "pdf" ? "Upload PDF" : "Quiz Gerador"}`,
    });
  })
);

/**
 * GET /api/onboarding/session/:session_id
 * Recuperar status da sessão
 */
router.get(
  "/session/:session_id",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const { session_id } = req.params;
    const session = getOnboardingSession(session_id, req.user.userId);

    if (!session) {
      throw new AppError(404, "Sessão não encontrada");
    }

    res.json({
      session_id: session.sessionId,
      path: session.path,
      created_at: session.createdAt.toISOString(),
      completed_at: session.completedAt?.toISOString() || null,
      is_complete: !!session.completedAt,
    });
  })
);

/**
 * POST /api/onboarding/session/:session_id/complete
 * Marcar sessão como completa
 */
router.post(
  "/session/:session_id/complete",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    const { session_id } = req.params;
    const session = completeOnboardingSession(session_id, req.user.userId);

    res.json({
      message: "Onboarding completado com sucesso",
      completed_at: session.completedAt?.toISOString(),
    });
  })
);

export default router;
