import { prisma } from "@/lib/prisma";

import {
  calcularPosicao,
} from "@/services/service";

export async function GET() {

  const assets =
    await prisma.asset.findMany({
      include: {
        transactions: {
          orderBy: {
            dataOperacao: "asc",
          },
        },
      },
    });

  const resultado: any[] = [];

  for (const asset of assets) {

    for (const tx of asset.transactions) {

      resultado.push({
        ...tx,

        asset,

        posicao:
          calcularPosicao(
            asset.transactions,
            tx.id
          ),
      });
    }
  }

  resultado.sort(
    (a, b) =>
      new Date(b.dataOperacao).getTime()
      -
      new Date(a.dataOperacao).getTime()
  );

  return Response.json(resultado);
}