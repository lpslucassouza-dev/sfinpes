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

export async function copiarLancamento(
  id: number
) {

  const lancamento =
    await prisma.lancamentoContaCorrente.findUnique({
      where: {
        id,
      },
    });

  if (!lancamento) {
    throw new Error(
      "Lançamento não encontrado"
    );
  }

  const novaData =
    new Date(lancamento.data);

  novaData.setMonth(
    novaData.getMonth() + 1
  );

  await prisma.lancamentoContaCorrente.create({
    data: {
      data: novaData,

      modalidade:
        lancamento.modalidade,

      categoriaId:
        lancamento.categoriaId,

      subCategoriaId:
        lancamento.subCategoriaId,

      descricao:
        lancamento.descricao,

      valorPlanejado:
        lancamento.valorPlanejado,

      valorRealizado:
        lancamento.valorRealizado,
    },
  });

  revalidatePath("/conta-corrente");

  return {
    sucesso: true,
  };
}

export async function copiarLancamentoAction(
  formData: FormData
) {
  const id = Number(
    formData.get("id")
  );

  await copiarLancamento(id);
}