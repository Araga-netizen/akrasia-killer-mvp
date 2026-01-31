import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createCipheriv, randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { AppError, PDFUploadRequest, PDFMetadata } from "../types/index.js";

// Mock database - em produção seria banco de dados
const pdfMetadataStore = new Map<string, PDFMetadata>();

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

/**
 * Verificar se arquivo é realmente PDF (magic bytes)
 */
export const isPDFFile = (buffer: Buffer): boolean => {
  // PDF magic bytes: %PDF
  const pdfMagicBytes = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
  return buffer.slice(0, 4).equals(pdfMagicBytes);
};

/**
 * Validar arquivo PDF
 */
export const validatePDFFile = (
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  size: number
): { valid: boolean; error?: string } => {
  // Validar tamanho
  if (size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: `PDF muito grande. Máximo: ${MAX_PDF_SIZE / 1024 / 1024}MB`,
    };
  }

  // Validar extensão
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    return {
      valid: false,
      error: "Arquivo deve ser do tipo PDF (.pdf)",
    };
  }

  // Validar MIME type
  if (mimeType !== "application/pdf") {
    return {
      valid: false,
      error: "MIME type inválido. Esperado: application/pdf",
    };
  }

  // Validar magic bytes (verificar se é realmente PDF)
  if (!isPDFFile(buffer)) {
    return {
      valid: false,
      error: "Arquivo não é um PDF válido (magic bytes inválidos)",
    };
  }

  return { valid: true };
};

/**
 * Criptografar PDF com AES-256-CBC
 */
export const encryptPDF = (
  buffer: Buffer
): { encrypted: Buffer; iv: string } => {
  const iv = randomBytes(IV_LENGTH);
  const encryptionKey = Buffer.from(
    process.env.ENCRYPTION_KEY || "default-key-256-chars-min-length-12345",
    "utf8"
  );

  // Padronizar chave para 256 bits (32 bytes)
  const key = Buffer.alloc(32);
  encryptionKey.copy(key);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    encrypted,
    iv: iv.toString("hex"),
  };
};

/**
 * Upload PDF para S3
 */
export const uploadPDFToS3 = async (
  buffer: Buffer,
  fileName: string,
  userId: string
): Promise<{ s3Key: string; pdfId: string }> => {
  const pdfId = uuidv4();
  const s3Key = `uploads/pdfs/${userId}/${pdfId}/${fileName}`;

  // Criptografar PDF antes de upload
  const { encrypted, iv } = encryptPDF(buffer);

  // Configurar S3
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
  });

  try {
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || "akrasia-pdfs-dev",
      Key: s3Key,
      Body: encrypted,
      ContentType: "application/pdf",
      ServerSideEncryption: "AES256",
      Metadata: {
        "original-filename": fileName,
        "user-id": userId,
        "pdf-id": pdfId,
        "encryption-iv": iv,
      },
    });

    await s3Client.send(putCommand);

    return { s3Key, pdfId };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new AppError(500, "Erro ao fazer upload do PDF");
  }
};

/**
 * Salvar metadados do PDF
 */
export const savePDFMetadata = (
  pdfId: string,
  userId: string,
  fileName: string,
  s3Key: string,
  size: number,
  mimeType: string
): PDFMetadata => {
  const metadata: PDFMetadata = {
    id: pdfId,
    user_id: userId,
    file_name: fileName,
    file_path: s3Key,
    size,
    mime_type: mimeType,
    s3_key: s3Key,
    processing_status: "queued",
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Mock: salvar em memória (em produção: banco de dados)
  pdfMetadataStore.set(pdfId, metadata);

  return metadata;
};

/**
 * Recuperar metadados do PDF
 */
export const getPDFMetadata = (
  pdfId: string,
  userId: string
): PDFMetadata | null => {
  const metadata = pdfMetadataStore.get(pdfId);

  // Verificar se usuário pode acessar este PDF
  if (!metadata || metadata.user_id !== userId) {
    return null;
  }

  return metadata;
};

/**
 * Atualizar status de processamento
 */
export const updatePDFStatus = (
  pdfId: string,
  status: "queued" | "processing" | "ready" | "error",
  errorMessage?: string
): void => {
  const metadata = pdfMetadataStore.get(pdfId);
  if (metadata) {
    metadata.processing_status = status;
    if (errorMessage) {
      metadata.error_message = errorMessage;
    }
    metadata.updated_at = new Date();
  }
};
