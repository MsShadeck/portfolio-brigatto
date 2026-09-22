"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { contatoSchema } from "@/lib/validations/contato";
import { isRateLimited } from "@/lib/rate-limit";

export type ContatoFormValues = {
  nome: string;
  email: string;
  telefone: string;
  tipoProjeto: string;
  texto: string;
};

export type ContatoState =
  | { type: "error" | "success"; message: string; values: ContatoFormValues }
  | undefined;

export async function enviarMensagem(
  _prevState: ContatoState,
  formData: FormData,
): Promise<ContatoState> {
  const values: ContatoFormValues = {
    nome: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
    telefone: String(formData.get("telefone") ?? ""),
    tipoProjeto: String(formData.get("tipoProjeto") ?? ""),
    texto: String(formData.get("texto") ?? ""),
  };

  const parsed = contatoSchema.safeParse({
    ...values,
    empresa: formData.get("empresa"),
  });

  if (!parsed.success) {
    // Honeypot preenchido: finge sucesso para não alertar o bot.
    if (formData.get("empresa")) {
      return {
        type: "success",
        message: "Mensagem enviada! Retornaremos em breve.",
        values,
      };
    }
    return {
      type: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os dados informados.",
      values,
    };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? "unknown";

  if (isRateLimited(ip)) {
    return {
      type: "error",
      message: "Muitas mensagens em pouco tempo. Tente novamente em alguns minutos.",
      values,
    };
  }

  const { nome, email, telefone, tipoProjeto, texto } = parsed.data;
  await prisma.mensagem.create({
    data: {
      nome,
      email,
      telefone: telefone || null,
      tipoProjeto: tipoProjeto || null,
      texto,
    },
  });

  return {
    type: "success",
    message: "Mensagem enviada! Retornaremos em breve.",
    values: { nome: "", email: "", telefone: "", tipoProjeto: "", texto: "" },
  };
}
