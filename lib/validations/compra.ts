import { z } from "zod";

export const compraSchema = z.object({
  dataCompra: z.string(),

  competencia: z.string(),

  usuarioId: z.string(),

  cartaoId: z.string(),

  categoriaId: z.string(),

  subCategoriaId: z.string().optional(),

  descricao: z.string().min(3),

  valorTotal: z.coerce.number(),

  totalParcelas: z.coerce.number().min(1),
});

export type CompraFormData =
  z.infer<typeof compraSchema>;
