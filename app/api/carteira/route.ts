import { prisma } from "@/lib/prisma";
import {calcularPosicaoAtual, } from "@/services/carteira.service";

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
  
  const rendimentos = await prisma.assetIncome.findMany();

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

    if (!grupos[asset.tipo]) {

      grupos[asset.tipo] = {
        tipo: asset.tipo,
        ativos: [],
        totalInvestido: 0,
        totalAtual: 0,
      };
    }

    const valorInvestido =
      posicao.valorInvestido;

    const usaValorManual = [
      "CRIPTO",
      "TESOURO_DIRETO",
      "PREV_PRIVADA",
      "FUNDO_INVESTIMENTO",
    ].includes(asset.tipo);
    
    const valorAtual =
      usaValorManual
        ? Number(
            asset.valorAtualManual || 0
          )

        : posicao.quantidadeAtual *
          Number(
            asset.valorAtual || 0
          );

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
        segmento: asset.segmento || "-",
        quantidadeAtual: posicao.quantidadeAtual,
        precoMedio: posicao.precoMedio,
        valorAtualCotacao: asset.valorAtual || 0,
        valorInvestido,
        valorAtual,
        resultado,
        rentabilidade,
        percentualNoTipo: 0,
        percentualCarteira: 0,
      });

    grupos[asset.tipo]
      .totalInvestido +=
        posicao.valorInvestido;

    grupos[asset.tipo].totalAtual += 
      valorAtual;

    patrimonioTotal +=
      valorAtual;
  }

  const resultado =
    Object.values(grupos).map(
    (grupo: any) => {

      grupo.ativos =
        grupo.ativos.map(
          (ativo: any) => ({

            ...ativo,

            percentualNoTipo:

              grupo.totalAtual > 0
              ? (
                  ativo.valorAtual *
                  100
                ) /
                grupo.totalAtual
              : 0,

            percentualCarteira:

              patrimonioTotal > 0
              ? (
                  ativo.valorAtual *
                  100
                ) /
                patrimonioTotal
              : 0,

          })
        );

      return {

        ...grupo,

        quantidadeAtivos:
          grupo.ativos.length,

        peso:
          patrimonioTotal > 0
          ? (
              grupo.totalAtual *
              100
            ) /
            patrimonioTotal
          : 0,

      };

    });

    const hoje = new Date();

    const inicio12Meses =
      new Date(
        hoje.getFullYear() - 1,
        hoje.getMonth(),
        hoje.getDate()
      );

    const proventos12m =
      rendimentos
        .filter(
          (r) =>
            r.dataRecebimento >=
            inicio12Meses
        )
        .reduce(
          (acc, r) =>
            acc + r.valorTotal,
          0
        );

    const mediaMensal =
      proventos12m / 12;

      const inicioMesAtual =
  new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  const ultimoMes =
    rendimentos
      .filter(
        (r) =>
          r.dataRecebimento >=
          inicioMesAtual
      )
      .reduce(
        (acc, r) =>
          acc + r.valorTotal,
        0
      );

  return Response.json({

    patrimonioTotal,
    grupos: resultado,
    indicadores: {
      proventos12m,
      mediaMensal,
      ultimoMes,
    },

  });
}