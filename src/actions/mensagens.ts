"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

export async function marcarMensagemLida(id: string, lida: boolean) {
  await requireAuth();
  await prisma.mensagem.update({ where: { id }, data: { lida } });
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
}

export async function deleteMensagem(id: string) {
  await requireAuth();
  await prisma.mensagem.delete({ where: { id } });
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
}
