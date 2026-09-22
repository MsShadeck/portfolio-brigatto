import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(2, "Informe o nome do cliente."),
  site: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//.test(v), "Informe uma URL válida (com http:// ou https://)."),
  depoimento: z.string().optional().or(z.literal("")),
  ordem: z.coerce.number().int().default(0),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
