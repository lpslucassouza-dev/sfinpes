import { prisma } from "@/lib/prisma";

import {
  calcularPosicaoAtual,
} from "@/services/carteira.service";

export async function GET() {

  const assets =
    await prisma.asset.findMany({

      where: {
        ativo: true,
      },

      include: {
        transactions: true,
      },

    });

  const grupos: Record<
    string,
    any
  > = {};

  let patrimonioTotal = 0;

  for (const asset of assets) {

    const posicao =
      calcularPosicaoAtual(
        asset.transactions
      );

    if (
      posicao.quantidadeAtual <= 0
    ) {
      continue;
    }

    patrimonioTotal +=
      posicao.valorInvestido;

    if (!grupos[asset.tipo]) {

      grupos[asset.tipo] = {

        tipo: asset.tipo,

        ativos: [],

        totalInvestido: 0,
      };
    }

    const valorInvestido =
      posicao.valorInvestido;

    const valorAtual =
      posicao.quantidadeAtual *
      (asset.valorAtual || 0);

    const resultado =
      valorAtual - valorInvestido;

    const rentabilidade =
      valorInvestido > 0
        ? (
            resultado * 100
          ) /
          valorInvestido
        : 0;

    grupos[asset.tipo].ativos.push({
      id: asset.id,
      ticker: asset.ticker,
      nome: asset.nome,
      setor: asset.setor,
      segmento: asset.segmento,
      valorAtualCotacao: asset.valorAtual || 0,
      quantidadeAtual: posicao.quantidadeAtual,
      precoMedio: posicao.precoMedio,
      valorInvestido,
      valorAtual,
      resultado,
      rentabilidade,
    });

    grupos[asset.tipo]
      .totalInvestido +=
        posicao.valorInvestido;
  }

  const resultado =
    Object.values(grupos).map(
      (grupo: any) => ({

        ...grupo,

        quantidadeAtivos:
          grupo.ativos.length,

        peso:
          patrimonioTotal > 0
            ? (
                grupo.totalInvestido *
                100
              ) /
              patrimonioTotal
            : 0,
      })
    );

  return Response.json({
    patrimonioTotal,

    grupos: resultado,
  });
}