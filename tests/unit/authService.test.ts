import { describe, it, expect, beforeEach } from "vitest";
import { signup, login, resetStores } from "../../src/backend/services/authService";
import { AppError } from "../../src/backend/types/index";

describe("Auth Service - Unit Tests", () => {
  beforeEach(() => {
    // Limpar state entre testes
    resetStores();
  });

  describe("signup", () => {
    it("Deve criar novo usuário com email e password válidos", async () => {
      const result = await signup(
        "user@test.com",
        "password123456",
        true
      );

      expect(result.userId).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.userId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    });

    it("Deve rejeitar email inválido", async () => {
      try {
        await signup("invalid-email", "password123456", true);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("Email");
      }
    });

    it("Deve rejeitar password muito curta", async () => {
      try {
        await signup("user@test.com", "short123", true);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("12 caracteres");
      }
    });

    it("Deve rejeitar signup sem consent GDPR", async () => {
      try {
        await signup("user@test.com", "password123456", false);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("Política");
      }
    });

    it("Deve rejeitar email duplicado", async () => {
      // Primeiro signup
      await signup("duplicate@test.com", "password123456", true);

      // Segundo signup com mesmo email
      try {
        await signup("duplicate@test.com", "password123456", true);
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("Email já registrado");
      }
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      // Criar usuário para testes de login
      await signup("test@test.com", "password123456", true);
    });

    it("Deve fazer login com credenciais corretas", async () => {
      const result = await login("test@test.com", "password123456");

      expect(result.userId).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.requiresMFA).toBe(false);
    });

    it("Deve rejeitar password incorreta", async () => {
      try {
        await login("test@test.com", "wrongpassword123");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("inválido");
      }
    });

    it("Deve rejeitar usuário inexistente", async () => {
      try {
        await login("nonexistent@test.com", "password123456");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("inválido");
      }
    });

    it("Deve rejeitar email inválido", async () => {
      try {
        await login("invalid-email", "password123456");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("inválido");
      }
    });

    it("Deve bloquear account após 5 tentativas falhas", async () => {
      // Fazer 5 tentativas falhas
      for (let i = 0; i < 5; i++) {
        try {
          await login("test@test.com", "wrongpassword123");
        } catch (error) {
          // Esperado
        }
      }

      // 6ª tentativa deve ser bloqueada
      try {
        await login("test@test.com", "wrongpassword123");
        throw new Error("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain("bloqueada");
      }
    });
  });
});
