import { prisma } from "@/lib/prisma";

export async function calcularDadosRendimento(
  assetId: string,
  valorTotal: number
) {

  const asset =
    await prisma.asset.findUnique({
        
      where: {
        id: assetId,
      },
      include: {
        transactions: true,
      },
    });

  if (!asset) {
    throw new Error(
      "Ativo não encontrado"
    );
  }

  let quantidadeAtual = 0;

  let custoTotal = 0;

  let precoMedio = 0;

  for (const tx of asset.transactions) {

    if (
      tx.tipoOperacao === "COMPRA"
    ) {

      custoTotal += tx.valorTotal;

      quantidadeAtual +=
        tx.quantidade;

      precoMedio =
        custoTotal /
        quantidadeAtual;
    }

    if (
      tx.tipoOperacao === "VENDA"
    ) {

      quantidadeAtual -=
        tx.quantidade;
    }
  }

  const valorUnitario =
    quantidadeAtual > 0
      ? valorTotal /
        quantidadeAtual
      : 0;

  const dy =
    precoMedio > 0
      ? (
          valorUnitario *
          100
        ) /
        precoMedio
      : 0;

  return {

    quantidadeCotas:
      quantidadeAtual,

    valorUnitario,

    dy,
  };
}