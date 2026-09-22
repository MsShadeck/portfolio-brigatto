import "server-only";
import { put } from "@vercel/blob";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

/**
 * Envia uma imagem enviada via <input type="file"> para o Vercel Blob e
 * devolve a URL pública. Retorna null se nenhum arquivo foi enviado
 * (campo de upload opcional/não alterado).
 */
export async function uploadImage(
  file: File | null | undefined,
  folder: "thumbnails" | "logos" | "perfil",
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG, WEBP ou SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Imagem muito grande. Tamanho máximo: 5MB.");
  }

  try {
    const blob = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No blob credentials found")) {
      throw new Error(
        "Upload de imagens não configurado: falta a variável BLOB_READ_WRITE_TOKEN no .env (veja o README).",
      );
    }
    throw error;
  }
}
