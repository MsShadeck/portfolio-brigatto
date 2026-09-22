"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { configuracaoSchema } from "@/lib/validations/configuracao";
import { uploadImage } from "@/lib/uploads";

export type ConfiguracaoFormValues = {
  nomeSite: string;
  heroTitulo: string;
  heroTexto: string;
  showreelUrl: string;
  bio: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  whatsapp: string;
  emailContato: string;
};

export type ConfiguracaoState =
  | { type: "error" | "success"; message: string; values: ConfiguracaoFormValues }
  | undefined;

function readFormValues(formData: FormData): ConfiguracaoFormValues {
  return {
    nomeSite: String(formData.get("nomeSite") ?? ""),
    heroTitulo: String(formData.get("heroTitulo") ?? ""),
    heroTexto: String(formData.get("heroTexto") ?? ""),
    showreelUrl: String(formData.get("showreelUrl") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    emailContato: String(formData.get("emailContato") ?? ""),
  };
}

export async function updateConfiguracao(
  _prevState: ConfiguracaoState,
  formData: FormData,
): Promise<ConfiguracaoState> {
  await requireAuth();

  const values = readFormValues(formData);
  const parsed = configuracaoSchema.safeParse(values);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
      values,
    };
  }

  const fotoFile = formData.get("foto") as File | null;
  let fotoUrl: string | null;
  try {
    fotoUrl = await uploadImage(fotoFile, "perfil");
  } catch (error) {
    return {
      type: "error",
      message: error instanceof Error ? error.message : "Falha ao enviar a foto.",
      values,
    };
  }

  const data = parsed.data;

  await prisma.configuracao.upsert({
    where: { id: "singleton" },
    update: {
      nomeSite: data.nomeSite,
      heroTitulo: data.heroTitulo,
      heroTexto: data.heroTexto || null,
      showreelUrl: data.showreelUrl || null,
      bio: data.bio || null,
      ...(fotoUrl ? { fotoUrl } : {}),
      instagramUrl: data.instagramUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      whatsapp: data.whatsapp || null,
      emailContato: data.emailContato || null,
    },
    create: {
      id: "singleton",
      nomeSite: data.nomeSite,
      heroTitulo: data.heroTitulo,
      heroTexto: data.heroTexto || null,
      showreelUrl: data.showreelUrl || null,
      bio: data.bio || null,
      fotoUrl: fotoUrl || null,
      instagramUrl: data.instagramUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      whatsapp: data.whatsapp || null,
      emailContato: data.emailContato || null,
    },
  });

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/contato");

  return { type: "success", message: "Configurações salvas com sucesso.", values };
}
