import { v4 as uuidv4 } from "uuid";
import { AppError } from "../types/index.js";

type OnboardingPath = "pdf" | "quiz";

interface OnboardingSession {
  sessionId: string;
  userId: string;
  path: OnboardingPath;
  createdAt: Date;
  completedAt?: Date;
}

// Mock database
const onboardingSessions = new Map<string, OnboardingSession>();

/**
 * Criar sessão de onboarding
 */
export const createOnboardingSession = (
  userId: string,
  path: OnboardingPath
): OnboardingSession => {
  // Validar path
  if (path !== "pdf" && path !== "quiz") {
    throw new AppError(400, "Path deve ser 'pdf' ou 'quiz'");
  }

  const session: OnboardingSession = {
    sessionId: uuidv4(),
    userId,
    path,
    createdAt: new Date(),
  };

  onboardingSessions.set(session.sessionId, session);

  console.log(`[Onboarding] Sessão criada: ${session.sessionId} (${path})`);

  return session;
};

/**
 * Completar sessão de onboarding
 */
export const completeOnboardingSession = (
  sessionId: string,
  userId: string
): OnboardingSession => {
  const session = onboardingSessions.get(sessionId);

  if (!session || session.userId !== userId) {
    throw new AppError(404, "Sessão de onboarding não encontrada");
  }

  session.completedAt = new Date();

  console.log(`[Onboarding] Sessão completada: ${sessionId}`);

  return session;
};

/**
 * Recuperar sessão
 */
export const getOnboardingSession = (
  sessionId: string,
  userId: string
): OnboardingSession | null => {
  const session = onboardingSessions.get(sessionId);

  if (!session || session.userId !== userId) {
    return null;
  }

  return session;
};

/**
 * Reset stores (testes)
 */
export const resetStores = () => {
  onboardingSessions.clear();
};
