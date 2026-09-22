import { z } from "zod";

export const videoSchema = z.object({
  titulo: z.string().min(2, "Informe o título."),
  urlVideo: z.string().url("Cole um link válido do YouTube ou Vimeo."),
  descricao: z.string().optional().or(z.literal("")),
  ano: z.coerce
    .number()
    .int()
    .min(2000, "Ano inválido.")
    .max(new Date().getFullYear() + 1, "Ano inválido."),
  funcao: z.string().optional().or(z.literal("")),
  destaque: z.coerce.boolean().default(false),
  publicado: z.coerce.boolean().default(false),
  ordem: z.coerce.number().int().default(0),
  clienteId: z.string().optional().or(z.literal("")),
  categoriaId: z.string().min(1, "Selecione uma categoria."),
});

export type VideoInput = z.infer<typeof videoSchema>;
