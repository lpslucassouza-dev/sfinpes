"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CriarLancamentoDTO = {
  data: string;
  modalidade:
    | "RECEITA"
    | "DESPESA"
    | "INVESTIMENTO";

  categoriaId: string;

  subCategoriaId?: string;

  descricao: string;

  valorPlanejado: number;

  valorRealizado: number;
};

export async function criarLancamento(
  dados: CriarLancamentoDTO
) {
  await prisma.lancamentoContaCorrente.create({
    data: {
      data: new Date(dados.data),

      modalidade: dados.modalidade,

      categoriaId: Number(
        dados.categoriaId
      ),

      subCategoriaId:
        dados.subCategoriaId
          ? Number(
              dados.subCategoriaId
            )
          : null,

      descricao: dados.descricao,

      valorPlanejado:
        dados.valorPlanejado,

      valorRealizado:
        dados.valorRealizado,
    },
  });

  revalidatePath("/conta-corrente");
}

export async function atualizarLancamento(
  id: number,
  dados: {
    data: string;
    modalidade:
      | "RECEITA"
      | "DESPESA"
      | "INVESTIMENTO";

    categoriaId: string;

    subCategoriaId?: string;

    descricao: string;

    valorPlanejado: number;

    valorRealizado: number;
  }
) {

  await prisma.lancamentoContaCorrente.update({
    where: {
      id,
    },

    data: {
      data: new Date(dados.data),

      modalidade: dados.modalidade,

      categoriaId: Number(dados.categoriaId),

      subCategoriaId:
        dados.subCategoriaId
          ? Number(dados.subCategoriaId)
          : null,

      descricao: dados.descricao,

      valorPlanejado: dados.valorPlanejado,

      valorRealizado: dados.valorRealizado,
    },
  });

  revalidatePath("/conta-corrente");
}

export async function excluirLancamento(
  id: number
) {
  await prisma.lancamentoContaCorrente.delete({
    where: {
      id,
    },
  });

  revalidatePath("/conta-corrente");
}