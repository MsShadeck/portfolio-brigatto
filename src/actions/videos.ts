"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { videoSchema } from "@/lib/validations/video";
import { slugify } from "@/lib/slug";
import { uploadImage } from "@/lib/uploads";

export type VideoFormValues = {
  titulo: string;
  urlVideo: string;
  descricao: string;
  ano: string;
  funcao: string;
  destaque: boolean;
  publicado: boolean;
  clienteId: string;
  categoriaId: string;
};

export type VideoFormState = { error: string; values: VideoFormValues } | undefined;

async function uniqueSlug(base: string, ignoreId?: string) {
  const raw = slugify(base) || "video";
  let slug = raw;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.video.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    suffix += 1;
    slug = `${raw}-${suffix}`;
  }
  return slug;
}

function readFormValues(formData: FormData): VideoFormValues {
  return {
    titulo: String(formData.get("titulo") ?? ""),
    urlVideo: String(formData.get("urlVideo") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    ano: String(formData.get("ano") ?? ""),
    funcao: String(formData.get("funcao") ?? ""),
    destaque: formData.get("destaque") === "on",
    publicado: formData.get("publicado") === "on",
    clienteId: String(formData.get("clienteId") ?? ""),
    categoriaId: String(formData.get("categoriaId") ?? ""),
  };
}

function parseVideoForm(values: VideoFormValues) {
  return videoSchema.safeParse({ ...values, ordem: 0 });
}

export async function createVideo(
  _prevState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> {
  await requireAuth();

  const values = readFormValues(formData);
  const parsed = parseVideoForm(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos.", values };
  }

  const thumbnailFile = formData.get("thumbnail") as File | null;
  let thumbnailUrl: string | null;
  try {
    thumbnailUrl = await uploadImage(thumbnailFile, "thumbnails");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha ao enviar a imagem.",
      values,
    };
  }
  if (!thumbnailUrl) {
    return { error: "Envie uma imagem de thumbnail.", values };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.titulo);

  await prisma.video.create({
    data: {
      titulo: data.titulo,
      slug,
      urlVideo: data.urlVideo,
      thumbnailUrl,
      descricao: data.descricao || null,
      ano: data.ano,
      funcao: data.funcao || null,
      destaque: data.destaque,
      publicado: data.publicado,
      ordem: 0,
      clienteId: data.clienteId || null,
      categoriaId: data.categoriaId,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/trabalhos");
  redirect("/admin/videos");
}

export async function updateVideo(
  id: string,
  _prevState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> {
  await requireAuth();

  const values = readFormValues(formData);
  const parsed = parseVideoForm(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos.", values };
  }

  const existente = await prisma.video.findUnique({ where: { id } });
  if (!existente) return { error: "Vídeo não encontrado.", values };

  const thumbnailFile = formData.get("thumbnail") as File | null;
  let thumbnailUrl: string | null;
  try {
    thumbnailUrl = await uploadImage(thumbnailFile, "thumbnails");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha ao enviar a imagem.",
      values,
    };
  }

  const data = parsed.data;
  const slug =
    data.titulo === existente.titulo ? existente.slug : await uniqueSlug(data.titulo, id);

  await prisma.video.update({
    where: { id },
    data: {
      titulo: data.titulo,
      slug,
      urlVideo: data.urlVideo,
      thumbnailUrl: thumbnailUrl ?? existente.thumbnailUrl,
      descricao: data.descricao || null,
      ano: data.ano,
      funcao: data.funcao || null,
      destaque: data.destaque,
      publicado: data.publicado,
      ordem: existente.ordem,
      clienteId: data.clienteId || null,
      categoriaId: data.categoriaId,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/trabalhos");
  revalidatePath(`/trabalhos/${slug}`);
  redirect("/admin/videos");
}

export async function deleteVideo(id: string) {
  await requireAuth();
  const removido = await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/trabalhos");
  revalidatePath(`/trabalhos/${removido.slug}`);
  redirect("/admin/videos");
}

export async function reorderVideos(orderedIds: string[]) {
  await requireAuth();

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.video.update({ where: { id }, data: { ordem: index } })),
  );

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/trabalhos");
}
