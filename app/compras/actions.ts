"use server";

import { prisma } from "@/lib/prisma";
import { compraSchema, CompraFormData, } from "@/lib/validations/compra";
import { revalidatePath } from "next/cache";
revalidatePath("/compras");
import { calcularStatusParcela } from "@/lib/parcelas";

export async function criarCompra(
  data: CompraFormData
) {
  const dados = compraSchema.parse(data);

  const [anoInicial, mesInicial] =
    dados.competencia
      .split("-")
      .map(Number);

  return await prisma.$transaction(
    async (tx) => {

      const cartao =
        await tx.cartao.findUnique({
          where: {
            id: Number(
              dados.cartaoId
            ),
          },
        });

      if (!cartao) {
        throw new Error(
          "Cartão não encontrado."
        );
      }

      const compra =
        await tx.compra.create({
          data: {
            dataCompra: new Date(
              dados.dataCompra
            ),

            competenciaMes:
              mesInicial,

            competenciaAno:
              anoInicial,

            descricao:
              dados.descricao,

            valorTotal:
              dados.valorTotal,

            totalParcelas:
              dados.totalParcelas,

            cartaoId:
              Number(
                dados.cartaoId
              ),

            usuarioId:
              Number(
                dados.usuarioId
              ),

            categoriaId:
              Number(
                dados.categoriaId
              ),

            subCategoriaId:
              dados.subCategoriaId
                ? Number(
                    dados.subCategoriaId
                  )
                : null,
          },
        });

      const valorParcela =
        Number(
          dados.valorTotal
        ) /
        Number(
          dados.totalParcelas
        );

      const cashbackPercent =
        Number(
          cartao.cashbackPercent
        );

      for (
        let i = 0;
        i < dados.totalParcelas;
        i++
      ) {

        const dataCompetencia =
          new Date(
            anoInicial,
            mesInicial - 1 + i,
            1
          );

        const cashback =
          (
            valorParcela *
            cashbackPercent
          ) / 100;

        await tx.parcela.create({
          data: {
            compraId:
              compra.id,

            numeroParcela:
              i + 1,

            totalParcelas:
              dados.totalParcelas,

            competenciaMes:
              dataCompetencia.getMonth() + 1,

            competenciaAno:
              dataCompetencia.getFullYear(),

            valorParcela,

            cashback,

            statusParcela:
              calcularStatusParcela(
                i + 1,
                dados.totalParcelas
              ),
          },
        });
      }
      revalidatePath("/compras");
      return compra;
    }
  );
}

export async function excluirCompra(
  compraId: number
) {
  await prisma.compra.delete({
    where: {
      id: compraId,
    },
  });

  revalidatePath("/compras");

  return {
    success: true,
  };
}

export async function atualizarCompra(
  compraId: number,
  dados: {
    descricao: string;
    usuarioId: number;
    categoriaId: number;
    subCategoriaId?: number | null;
  }
) {
  await prisma.compra.update({
    where: {
      id: compraId,
    },

    data: {
      descricao: dados.descricao,
      usuarioId: dados.usuarioId,
      categoriaId: dados.categoriaId,
      subCategoriaId:
        dados.subCategoriaId ?? null,
    },
  });

  revalidatePath("/compras");

  return {
    success: true,
  };
}