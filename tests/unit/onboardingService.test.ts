import { describe, it, expect, beforeEach } from "vitest";
import {
  createOnboardingSession,
  completeOnboardingSession,
  getOnboardingSession,
  resetStores,
} from "../../src/backend/services/onboardingService";
import { AppError } from "../../src/backend/types/index";

describe("Onboarding Service - Unit Tests", () => {
  beforeEach(() => {
    resetStores();
  });

  describe("createOnboardingSession", () => {
    it("Deve criar sessão com path 'pdf'", () => {
      const session = createOnboardingSession("user-123", "pdf");

      expect(session.sessionId).toBeDefined();
      expect(session.userId).toBe("user-123");
      expect(session.path).toBe("pdf");
      expect(session.createdAt).toBeDefined();
      expect(session.completedAt).toBeUndefined();
    });

    it("Deve criar sessão com path 'quiz'", () => {
      const session = createOnboardingSession("user-123", "quiz");

      expect(session.path).toBe("quiz");
    });

    it("Deve rejeitar path inválido", () => {
      try {
        createOnboardingSession("user-123", "invalid" as any);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("pdf");
      }
    });
  });

  describe("completeOnboardingSession", () => {
    it("Deve marcar sessão como completa", () => {
      const session = createOnboardingSession("user-123", "pdf");
      const completed = completeOnboardingSession(session.sessionId, "user-123");

      expect(completed.completedAt).toBeDefined();
    });

    it("Deve rejeitar sessão inexistente", () => {
      try {
        completeOnboardingSession("nonexistent", "user-123");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("não encontrada");
      }
    });

    it("Deve verificar propriedade do usuário", () => {
      const session = createOnboardingSession("user-123", "pdf");

      try {
        completeOnboardingSession(session.sessionId, "user-456");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe("getOnboardingSession", () => {
    it("Deve recuperar sessão", () => {
      const created = createOnboardingSession("user-123", "pdf");
      const retrieved = getOnboardingSession(created.sessionId, "user-123");

      expect(retrieved).toEqual(created);
    });

    it("Deve retornar null para sessão inexistente", () => {
      const result = getOnboardingSession("nonexistent", "user-123");
      expect(result).toBeNull();
    });

    it("Deve verificar propriedade do usuário", () => {
      const session = createOnboardingSession("user-123", "pdf");
      const result = getOnboardingSession(session.sessionId, "user-456");

      expect(result).toBeNull();
    });
  });
});
