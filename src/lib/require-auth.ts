import "server-only";
import { auth } from "./auth";

/**
 * Segunda camada de proteção além do middleware: toda server action que
 * altera dados no admin deve chamar isto antes de tocar no banco.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }
  return session;
}
