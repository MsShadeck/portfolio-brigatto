import { z } from "zod";

export const contatoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string().optional().or(z.literal("")),
  tipoProjeto: z.string().optional().or(z.literal("")),
  texto: z.string().min(10, "Conte um pouco mais sobre o projeto."),
  // honeypot: campo invisível para humanos; se vier preenchido, é bot.
  empresa: z.string().max(0).optional().or(z.literal("")),
});

export type ContatoInput = z.infer<typeof contatoSchema>;
