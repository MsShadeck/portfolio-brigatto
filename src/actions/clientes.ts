"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { clienteSchema } from "@/lib/validations/cliente";
import { uploadImage } from "@/lib/uploads";

export type ClienteFormValues = {
  nome: string;
  site: string;
  depoimento: string;
};

export type ClienteFormState = { error: string; values: ClienteFormValues } | undefined;

function readFormValues(formData: FormData): ClienteFormValues {
  return {
    nome: String(formData.get("nome") ?? ""),
    site: String(formData.get("site") ?? ""),
    depoimento: String(formData.get("depoimento") ?? ""),
  };
}

function parseClienteForm(values: ClienteFormValues) {
  return clienteSchema.safeParse({ ...values, ordem: 0 });
}

export async function createCliente(
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  await requireAuth();

  const values = readFormValues(formData);
  const parsed = parseClienteForm(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos.", values };
  }

  const logoFile = formData.get("logo") as File | null;
  let logoUrl: string | null;
  try {
    logoUrl = await uploadImage(logoFile, "logos");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha ao enviar a logo.",
      values,
    };
  }
  if (!logoUrl) return { error: "Envie a logo do cliente.", values };

  const data = parsed.data;
  await prisma.cliente.create({
    data: {
      nome: data.nome,
      logoUrl,
      site: data.site || null,
      depoimento: data.depoimento || null,
      ordem: 0,
    },
  });

  revalidatePath("/admin/clientes");
  revalidatePath("/clientes");
  revalidatePath("/");
  redirect("/admin/clientes");
}

export async function updateCliente(
  id: string,
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  await requireAuth();

  const values = readFormValues(formData);
  const parsed = parseClienteForm(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos.", values };
  }

  const existente = await prisma.cliente.findUnique({ where: { id } });
  if (!existente) return { error: "Cliente não encontrado.", values };

  const logoFile = formData.get("logo") as File | null;
  let logoUrl: string | null;
  try {
    logoUrl = await uploadImage(logoFile, "logos");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha ao enviar a logo.",
      values,
    };
  }

  const data = parsed.data;
  await prisma.cliente.update({
    where: { id },
    data: {
      nome: data.nome,
      logoUrl: logoUrl ?? existente.logoUrl,
      site: data.site || null,
      depoimento: data.depoimento || null,
      ordem: existente.ordem,
    },
  });

  revalidatePath("/admin/clientes");
  revalidatePath("/clientes");
  revalidatePath("/");
  redirect("/admin/clientes");
}

export async function deleteCliente(id: string) {
  await requireAuth();
  await prisma.cliente.delete({ where: { id } });
  revalidatePath("/admin/clientes");
  revalidatePath("/clientes");
  revalidatePath("/");
  revalidatePath("/trabalhos");
  redirect("/admin/clientes");
}

export async function reorderClientes(orderedIds: string[]) {
  await requireAuth();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.cliente.update({ where: { id }, data: { ordem: index } }),
    ),
  );

  revalidatePath("/admin/clientes");
  revalidatePath("/clientes");
  revalidatePath("/");
}
