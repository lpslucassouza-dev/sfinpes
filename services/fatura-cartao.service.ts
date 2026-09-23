import { prisma } from "@/lib/prisma";

export async function atualizarFaturasCartao() {

  const parcelas =
    await prisma.parcela.findMany({
      include: {
        compra: {
          include: {
            cartao: true,
          },
        },
      },
    });

  const agrupado = new Map<
    string,
    {
      cartao: string;
      competenciaMes: number;
      competenciaAno: number;
      valor: number;
    }
  >();

  for (const parcela of parcelas) {

    const cartao =
      parcela.compra.cartao.nome;

    const chave =
      `${cartao}-${parcela.competenciaAno}-${parcela.competenciaMes}`;

    if (!agrupado.has(chave)) {

      agrupado.set(chave, {

        cartao,

        competenciaMes:
          parcela.competenciaMes,

        competenciaAno:
          parcela.competenciaAno,

        valor: 0,

      });

    }

    agrupado.get(chave)!.valor +=
      Number(parcela.valorParcela);

  }

  const categoria =
    await prisma.categoria.findFirst({
      where: {
        nome:
          "Faturas Cartão de Crédito",
      },
    });

  if (!categoria) {

    throw new Error(
      "Categoria Faturas Cartão de Crédito não encontrada."
    );

  }

  for (const item of agrupado.values()) {

    const descricao =
      `Fatura Cartão de Crédito ${item.cartao}`;

    const data =
      new Date(
        item.competenciaAno,
        item.competenciaMes,
        10
      );

      const hoje = new Date();

      const inicioMesSeguinte =
        new Date(
          hoje.getFullYear(),
          hoje.getMonth() + 1,
          1
        );

      if (data < inicioMesSeguinte) {
        continue;
      }

    const subCategoria =
      await prisma.subCategoria.findFirst({
        where: {
          nome:
            `Fatura ${item.cartao}`,
        },
      });

    const existente =
      await prisma.lancamentoContaCorrente.findFirst({

        where: {

          descricao,

          data,

        },

      });

    if (existente) {

      await prisma.lancamentoContaCorrente.update({

        where: {
          id: existente.id,
        },

        data: {

          valorPlanejado:
            item.valor,

        },

      });

    } else {

      await prisma.lancamentoContaCorrente.create({

        data: {

          data,

          modalidade:
            "DESPESA",

          categoriaId:
            categoria.id,

          subCategoriaId:
            subCategoria?.id,

          descricao,

          valorPlanejado:
            item.valor,

          valorRealizado: 0,

        },

      });

    }

    for (const parcela of parcelas) {

        if (
          parcela.compra.cartao.nome === "VISA" &&
          parcela.competenciaMes === 9 &&
          parcela.competenciaAno === 2026
        ) {

          console.log(
            "VISA SET/2026",
            parcela.compra.descricao,
            parcela.numeroParcela,
            Number(parcela.valorParcela)
          );

        }
    }

  }

}