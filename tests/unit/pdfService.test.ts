import { describe, it, expect } from "vitest";
import { validatePDFFile, isPDFFile } from "../../src/backend/services/pdfService";

describe("PDF Service - Unit Tests", () => {
  describe("validatePDFFile", () => {
    // PDF magic bytes: %PDF
    const validPDFBuffer = Buffer.from([
      0x25, 0x50, 0x44, 0x46, // %PDF
      0x2d, 0x31, 0x2e, 0x34, // -1.4
    ]);

    it("Deve validar PDF válido", () => {
      const result = validatePDFFile(
        validPDFBuffer,
        "test.pdf",
        "application/pdf",
        1024
      );

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("Deve rejeitar arquivo maior que 10MB", () => {
      const size = 11 * 1024 * 1024; // 11MB

      const result = validatePDFFile(
        validPDFBuffer,
        "large.pdf",
        "application/pdf",
        size
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("muito grande");
    });

    it("Deve rejeitar arquivo sem extensão .pdf", () => {
      const result = validatePDFFile(
        validPDFBuffer,
        "document.txt",
        "application/pdf",
        1024
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("PDF");
    });

    it("Deve rejeitar arquivo com MIME type incorreto", () => {
      const result = validatePDFFile(
        validPDFBuffer,
        "test.pdf",
        "text/plain",
        1024
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("MIME type");
    });

    it("Deve rejeitar arquivo sem magic bytes de PDF", () => {
      const invalidBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);

      const result = validatePDFFile(
        invalidBuffer,
        "test.pdf",
        "application/pdf",
        1024
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("magic bytes");
    });

    it("Deve validar múltiplos PDFs diferentes", () => {
      const buffers = [
        Buffer.from([0x25, 0x50, 0x44, 0x46]), // %PDF
        Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]), // %PDF-1.5
        Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x32, 0x2e, 0x30]), // %PDF-2.0
      ];

      buffers.forEach((buffer) => {
        const result = validatePDFFile(
          buffer,
          "test.pdf",
          "application/pdf",
          1024
        );
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("isPDFFile", () => {
    it("Deve reconhecer magic bytes de PDF válido", () => {
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
      expect(isPDFFile(pdfBuffer)).toBe(true);
    });

    it("Deve rejeitar buffer sem magic bytes PDF", () => {
      const invalidBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // ZIP header
      expect(isPDFFile(invalidBuffer)).toBe(false);
    });
  });
});
