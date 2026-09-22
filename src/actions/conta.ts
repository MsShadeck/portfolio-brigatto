"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { changePasswordSchema } from "@/lib/validations/auth";

export type ContaState = { type: "error" | "success"; message: string } | undefined;

export async function changePassword(
  _prevState: ContaState,
  formData: FormData,
): Promise<ContaState> {
  const session = await requireAuth();

  const parsed = changePasswordSchema.safeParse({
    senhaAtual: formData.get("senhaAtual"),
    novaSenha: formData.get("novaSenha"),
    confirmarSenha: formData.get("confirmarSenha"),
  });

  if (!parsed.success) {
    return { type: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  if (!user) return { type: "error", message: "Usuário não encontrado." };

  const senhaValida = await bcrypt.compare(parsed.data.senhaAtual, user.senhaHash);
  if (!senhaValida) return { type: "error", message: "Senha atual incorreta." };

  const senhaHash = await bcrypt.hash(parsed.data.novaSenha, 10);
  await prisma.user.update({ where: { id: user.id }, data: { senhaHash } });

  return { type: "success", message: "Senha alterada com sucesso." };
}
