import { describe, it, expect, beforeEach } from "vitest";
import {
  recordConsent,
  getUserConsent,
  hasActiveConsent,
  revokeConsent,
  resetStores,
} from "../../src/backend/services/consentService";
import { AppError } from "../../src/backend/types/index";

describe("Consent Service - Unit Tests", () => {
  beforeEach(() => {
    resetStores();
  });

  describe("recordConsent", () => {
    it("Deve registrar consentimento válido", () => {
      const result = recordConsent("user-123", true, true, true);

      expect(result.userId).toBe("user-123");
      expect(result.policies.privacyPolicy).toBe(true);
      expect(result.policies.dataProcessing).toBe(true);
      expect(result.policies.aiProcessing).toBe(true);
      expect(result.revokedAt).toBeUndefined();
    });

    it("Deve rejeitar se algum consentimento for false", () => {
      try {
        recordConsent("user-123", true, false, true);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("obrigatórios");
      }
    });
  });

  describe("hasActiveConsent", () => {
    it("Deve retornar true para consentimento ativo", () => {
      recordConsent("user-123", true, true, true);
      expect(hasActiveConsent("user-123")).toBe(true);
    });

    it("Deve retornar false para consentimento inexistente", () => {
      expect(hasActiveConsent("nonexistent")).toBe(false);
    });

    it("Deve retornar false após revogar", () => {
      recordConsent("user-123", true, true, true);
      revokeConsent("user-123");
      expect(hasActiveConsent("user-123")).toBe(false);
    });
  });

  describe("revokeConsent", () => {
    it("Deve revogar consentimento existente", () => {
      recordConsent("user-123", true, true, true);
      revokeConsent("user-123");

      const consent = getUserConsent("user-123");
      expect(consent?.revokedAt).toBeDefined();
    });

    it("Deve lançar erro ao revogar consentimento inexistente", () => {
      try {
        revokeConsent("nonexistent");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("não encontrado");
      }
    });
  });
});
