import { AppError } from "../types/index.js";

interface ConsentRecord {
  userId: string;
  consentDate: Date;
  version: string;
  policies: {
    privacyPolicy: boolean;
    dataProcessing: boolean;
    aiProcessing: boolean;
  };
  revokedAt?: Date;
}

// Mock database
const consentStore = new Map<string, ConsentRecord>();

const CURRENT_VERSION = "1.0";

/**
 * Registrar consentimento do usuário
 */
export const recordConsent = (
  userId: string,
  privacyPolicy: boolean,
  dataProcessing: boolean,
  aiProcessing: boolean
): ConsentRecord => {
  if (!privacyPolicy || !dataProcessing || !aiProcessing) {
    throw new AppError(
      400,
      "Todos os 3 consentimentos são obrigatórios"
    );
  }

  const consent: ConsentRecord = {
    userId,
    consentDate: new Date(),
    version: CURRENT_VERSION,
    policies: {
      privacyPolicy,
      dataProcessing,
      aiProcessing,
    },
  };

  consentStore.set(userId, consent);

  console.log(`[Consent] Consentimento registrado: ${userId}`);

  return consent;
};

/**
 * Recuperar consentimento do usuário
 */
export const getUserConsent = (userId: string): ConsentRecord | null => {
  return consentStore.get(userId) || null;
};

/**
 * Verificar se usuário tem consentimento ativo
 */
export const hasActiveConsent = (userId: string): boolean => {
  const consent = consentStore.get(userId);
  return (
    consent !== undefined &&
    consent.policies.privacyPolicy &&
    consent.policies.dataProcessing &&
    consent.policies.aiProcessing &&
    !consent.revokedAt
  );
};

/**
 * Revogar consentimento
 */
export const revokeConsent = (userId: string): void => {
  const consent = consentStore.get(userId);

  if (!consent) {
    throw new AppError(404, "Consentimento não encontrado");
  }

  consent.revokedAt = new Date();
  console.log(`[Consent] Consentimento revogado: ${userId}`);
};

/**
 * Reset stores (apenas para testes)
 */
export const resetStores = () => {
  consentStore.clear();
};
