import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../middleware/auth.js";
import { AppError } from "../types/index.js";

// Mock database
const userStore = new Map<string, { id: string; email: string; passwordHash: string; createdAt: Date }>();
const loginAttempts = new Map<string, { count: number; timestamp: Date }>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos
const BCRYPT_ROUNDS = 10;

/**
 * Validar email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar força de password
 */
const isStrongPassword = (password: string): boolean => {
  // Mínimo 12 caracteres
  return password.length >= 12;
};

/**
 * Signup - Criar novo usuário
 */
export const signup = async (
  email: string,
  password: string,
  consentGDPR: boolean
): Promise<{ userId: string; token: string; refreshToken: string }> => {
  // Validar email
  if (!isValidEmail(email)) {
    throw new AppError(400, "Email inválido");
  }

  // Validar password
  if (!isStrongPassword(password)) {
    throw new AppError(
      400,
      "Password deve ter no mínimo 12 caracteres"
    );
  }

  // Validar GDPR
  if (!consentGDPR) {
    throw new AppError(400, "Deve aceitar a Política de Privacidade");
  }

  // Verificar se email já existe
  for (const user of userStore.values()) {
    if (user.email === email) {
      throw new AppError(409, "Email já registrado");
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Criar usuário
  const userId = uuidv4();
  const user = {
    id: userId,
    email,
    passwordHash,
    createdAt: new Date(),
  };

  userStore.set(userId, user);

  // Gerar tokens
  const token = generateToken(userId, email);
  const refreshToken = generateToken(userId, email); // Em produção: diferentes secrets

  console.log(`[Auth] Usuário criado: ${email} (${userId})`);

  return { userId, token, refreshToken };
};

/**
 * Login - Autenticar usuário
 */
export const login = async (
  email: string,
  password: string
): Promise<{ userId: string; token: string; refreshToken: string; requiresMFA?: boolean }> => {
  // Validar email
  if (!isValidEmail(email)) {
    throw new AppError(400, "Email ou password inválido");
  }

  // Verificar tentativas de login
  const attemptKey = email.toLowerCase();
  const attempt = loginAttempts.get(attemptKey);

  if (attempt) {
    const timeSinceLastAttempt = Date.now() - attempt.timestamp.getTime();

    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      if (timeSinceLastAttempt < LOCK_TIME_MS) {
        throw new AppError(429, "Conta bloqueada temporariamente. Tente em 15 minutos");
      } else {
        // Reset attempts
        loginAttempts.delete(attemptKey);
      }
    }
  }

  // Encontrar usuário
  let user = null;
  for (const u of userStore.values()) {
    if (u.email === email) {
      user = u;
      break;
    }
  }

  if (!user) {
    // Registrar tentativa falhada
    const attempts = loginAttempts.get(attemptKey) || { count: 0, timestamp: new Date() };
    attempts.count++;
    attempts.timestamp = new Date();
    loginAttempts.set(attemptKey, attempts);

    throw new AppError(400, "Email ou password inválido");
  }

  // Verificar password
  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    // Registrar tentativa falhada
    const attempts = loginAttempts.get(attemptKey) || { count: 0, timestamp: new Date() };
    attempts.count++;
    attempts.timestamp = new Date();
    loginAttempts.set(attemptKey, attempts);

    throw new AppError(400, "Email ou password inválido");
  }

  // Reset attempts após login bem-sucedido
  loginAttempts.delete(attemptKey);

  // Gerar tokens
  const token = generateToken(user.id, user.email);
  const refreshToken = generateToken(user.id, user.email);

  console.log(`[Auth] Login bem-sucedido: ${email}`);

  return {
    userId: user.id,
    token,
    refreshToken,
    requiresMFA: false, // MFA será implementado em Phase 2
  };
};

/**
 * Recuperar usuário por ID
 */
export const getUserById = (userId: string) => {
  return userStore.get(userId);
};

/**
 * Reset stores (apenas para testes)
 */
export const resetStores = () => {
  userStore.clear();
  loginAttempts.clear();
};
