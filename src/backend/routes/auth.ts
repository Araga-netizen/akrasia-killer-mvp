import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { signup, login } from "../services/authService.js";
import { AppError } from "../types/index.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas por IP
  message: "Muitas tentativas. Tente novamente em 15 minutos",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/signup
 * Criar nova conta
 *
 * Acceptance Criteria:
 * - Validação: email válido, password >= 12 chars
 * - Consent GDPR obrigatório
 * - Response: { user_id, token, refresh_token }
 */
router.post(
  "/signup",
  authLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, consent_gdpr } = req.body;

    // Validar input
    if (!email || !password) {
      throw new AppError(400, "Email e password são obrigatórios");
    }

    if (typeof consent_gdpr !== "boolean" || !consent_gdpr) {
      throw new AppError(400, "Deve aceitar a Política de Privacidade");
    }

    // Signup
    const result = await signup(email, password, consent_gdpr);

    res.status(201).json({
      user_id: result.userId,
      token: result.token,
      refresh_token: result.refreshToken,
      message: "Conta criada com sucesso",
    });
  })
);

/**
 * POST /api/auth/login
 * Autenticar usuário
 *
 * Acceptance Criteria:
 * - Email e password obrigatórios
 * - Rate limiting: 5 tentativas/15 min
 * - Response: { token, refresh_token, requires_mfa }
 */
router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validar input
    if (!email || !password) {
      throw new AppError(400, "Email e password são obrigatórios");
    }

    // Login
    const result = await login(email, password);

    res.json({
      token: result.token,
      refresh_token: result.refreshToken,
      requires_mfa: result.requiresMFA,
      message: "Login bem-sucedido",
    });
  })
);

export default router;
