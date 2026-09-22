import { z } from "zod";

const optionalUrl = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\//.test(v), "Informe uma URL válida (com http:// ou https://).");

export const configuracaoSchema = z.object({
  nomeSite: z.string().min(2, "Informe o nome do site."),
  heroTitulo: z.string().min(2, "Informe o título de destaque."),
  heroTexto: z.string().optional().or(z.literal("")),
  showreelUrl: optionalUrl,
  bio: z.string().optional().or(z.literal("")),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  whatsapp: z.string().optional().or(z.literal("")),
  emailContato: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail inválido."),
});

export type ConfiguracaoInput = z.infer<typeof configuracaoSchema>;
