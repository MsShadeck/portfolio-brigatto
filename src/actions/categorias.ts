"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { categoriaSchema } from "@/lib/validations/categoria";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string, ignoreId?: string) {
  const raw = slugify(base) || "categoria";
  let slug = raw;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.categoria.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    suffix += 1;
    slug = `${raw}-${suffix}`;
  }
  return slug;
}

export async function createCategoria(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAuth();

  const parsed = categoriaSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const slug = await uniqueSlug(parsed.data.nome);
  await prisma.categoria.create({ data: { nome: parsed.data.nome, slug } });

  revalidatePath("/admin/categorias");
  revalidatePath("/trabalhos");
}

export async function updateCategoria(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAuth();

  const parsed = categoriaSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const existente = await prisma.categoria.findUnique({ where: { id } });
  if (!existente) return "Categoria não encontrada.";

  const slug =
    parsed.data.nome === existente.nome ? existente.slug : await uniqueSlug(parsed.data.nome, id);

  await prisma.categoria.update({ where: { id }, data: { nome: parsed.data.nome, slug } });

  revalidatePath("/admin/categorias");
  revalidatePath("/trabalhos");
}

export async function deleteCategoria(id: string): Promise<string | undefined> {
  await requireAuth();

  const emUso = await prisma.video.count({ where: { categoriaId: id } });
  if (emUso > 0) {
    return `Não é possível excluir: ${emUso} vídeo(s) usam esta categoria.`;
  }

  await prisma.categoria.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/trabalhos");
}
